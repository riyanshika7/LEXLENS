"""Security headers, rate limiting, and observability middleware."""

import time
import uuid
from collections import defaultdict
from typing import Dict, List
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from backend.config import settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Inject OWASP recommended security headers into all responses."""

    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

        response: Response = await call_next(request)

        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time-Ms"] = str(duration_ms)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=(), payment=()"
        )
        # Content Security Policy (allows API calls and safe assets)
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "img-src 'self' data: https:; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "script-src 'self' 'unsafe-inline'; "
            "connect-src 'self' https://generativelanguage.googleapis.com;"
        )
        return response


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    Sliding window in-memory rate limiter per IP address.
    Configurable via settings.RATE_LIMIT_REQUESTS_PER_MINUTE.
    """

    def __init__(self, app):
        super().__init__(app)
        self.requests_log: Dict[str, List[float]] = defaultdict(list)
        self.limit = settings.RATE_LIMIT_REQUESTS_PER_MINUTE
        self.window_seconds = 60.0

    async def dispatch(self, request: Request, call_next):
        # Exclude health check and metrics from rate limiting
        if request.url.path in ["/api/health", "/docs", "/openapi.json"]:
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        # Clean timestamps older than window
        timestamps = self.requests_log[client_ip]
        valid_timestamps = [t for t in timestamps if now - t < self.window_seconds]
        self.requests_log[client_ip] = valid_timestamps

        if len(valid_timestamps) >= self.limit:
            retry_after = int(self.window_seconds - (now - valid_timestamps[0]))
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Rate limit exceeded",
                    "message": f"Too many requests. Please try again in {max(retry_after, 1)} seconds.",
                    "code": "RATE_LIMIT_EXCEEDED",
                },
                headers={"Retry-After": str(max(retry_after, 1))},
            )

        self.requests_log[client_ip].append(now)
        return await call_next(request)
