"""Legal clause taxonomy classification and plain-language extraction heuristics."""

import re
import uuid
from typing import Dict, List, Optional
from backend.schemas.analysis import ClauseItem
from backend.schemas.document import DocumentChunk


CLAUSE_PATTERNS = {
    "Termination": {
        "keywords": ["terminate", "termination", "cancel", "cancellation", "default", "breach of agreement", "surrender"],
        "regex": r"(?:terminate|termination|cancel|cancellation|right to terminate|effective immediately|upon notice)",
        "explanation": "Explains how, when, and under what conditions either party can end this agreement.",
        "why_it_matters": "If you don't follow the exact notice period or conditions, you could be locked into financial obligations or sued for breach of contract.",
        "consideration": "Check if termination requires written notice, how many days in advance, and whether either party can terminate without cause.",
        "ask_lawyer": True,
    },
    "Payment": {
        "keywords": ["payment", "fee", "rent", "compensation", "invoice", "due date", "late charge", "interest", "deposit", "salary"],
        "regex": r"(?:payment|rent|fee|compensation|invoiced|due date|late fee|security deposit|payable within)",
        "explanation": "Outlines monetary amounts owed, due dates, payment methods, and penalties for late payment.",
        "why_it_matters": "Failing to pay on time or misunderstanding additional fees (e.g., maintenance, utilities, late interest) can result in immediate default.",
        "consideration": "Look out for automatic price increases, hidden pass-through costs, and grace periods before late fees trigger.",
        "ask_lawyer": False,
    },
    "Liability": {
        "keywords": ["liability", "limitation of liability", "indirect damages", "consequential damages", "cap on liability", "aggregate liability", "sole remedy"],
        "regex": r"(?:limitation of liability|in no event shall|consequential damages|punitive damages|maximum aggregate liability|total liability)",
        "explanation": "Caps the financial damages one party can recover from the other if something goes wrong.",
        "why_it_matters": "A one-sided liability cap means if the other party causes you major financial loss, you might be prevented from recovering your full losses.",
        "consideration": "Confirm whether liability is mutual and whether the dollar cap is realistic relative to the contract value.",
        "ask_lawyer": True,
    },
    "Indemnification": {
        "keywords": ["indemnify", "indemnity", "hold harmless", "defend and hold harmless", "indemnification"],
        "regex": r"(?:indemnify|indemnification|hold harmless|defend, indemnify|defend and hold)",
        "explanation": "Requires one party to legally defend the other and pay for their legal costs, damages, or settlements.",
        "why_it_matters": "This is one of the highest-risk legal clauses. You could be forced to pay thousands of dollars in lawyer fees for third-party claims.",
        "consideration": "Ensure indemnification is mutual and strictly limited to your direct, intentional negligence, not general occurrences.",
        "ask_lawyer": True,
    },
    "Confidentiality": {
        "keywords": ["confidential", "confidentiality", "proprietary information", "non-disclosure", "trade secret"],
        "regex": r"(?:confidential information|non-disclosure|proprietary information|trade secrets|keep confidential)",
        "explanation": "Protects private business information, trade secrets, and customer data from being shared publicly or with competitors.",
        "why_it_matters": "Accidental disclosure could subject you to legal injunctions and significant financial claims.",
        "consideration": "Check how long confidentiality lasts after the contract ends (e.g. 2 years vs indefinite) and standard exclusions.",
        "ask_lawyer": False,
    },
    "Restrictions": {
        "keywords": ["non-compete", "non-solicitation", "restrictive covenant", "restraint of trade", "exclusivity", "conflict of interest"],
        "regex": r"(?:non-compete|non-competition|non-solicit|non-solicitation|covenant not to compete|exclusive engagement)",
        "explanation": "Restricts your ability to work with competitors, start a similar business, or hire colleagues after leaving.",
        "why_it_matters": "May severely hinder your future employment opportunities or livelihood within your industry or geographic area.",
        "consideration": "Many jurisdictions strictly limit or ban non-compete clauses. Ask a lawyer whether this restriction is enforceable in your state.",
        "ask_lawyer": True,
    },
    "Dispute Resolution": {
        "keywords": ["arbitration", "mediation", "dispute", "jurisdiction", "governing law", "venue", "jury trial waiver"],
        "regex": r"(?:arbitration|binding arbitration|dispute resolution|waives any right to a jury|venue in|american arbitration)",
        "explanation": "Determines where and how legal conflicts must be resolved (e.g., binding private arbitration instead of a public court trial).",
        "why_it_matters": "Mandatory arbitration can be costly, strips away your right to a jury trial, and often prevents class actions.",
        "consideration": "Verify who pays the arbitrator's fees and whether the designated city/state is convenient for you.",
        "ask_lawyer": True,
    },
    "Governing Law": {
        "keywords": ["governing law", "laws of the state", "construed in accordance with", "jurisdiction of the courts"],
        "regex": r"(?:governed by and construed|laws of the state of|jurisdiction of the state|exclusive jurisdiction)",
        "explanation": "Specifies which state's or country's legal system controls the interpretation and enforcement of this document.",
        "why_it_matters": "Different jurisdictions have vastly different protections for tenants, employees, and consumers.",
        "consideration": "If the chosen jurisdiction is far away, hiring local counsel or attending hearings there may be very expensive.",
        "ask_lawyer": False,
    },
    "Intellectual Property": {
        "keywords": ["intellectual property", "work made for hire", "copyright", "patent", "assignment of inventions", "proprietary rights"],
        "regex": r"(?:work made for hire|assignment of inventions|all right, title and interest|intellectual property rights)",
        "explanation": "Defines who owns any creations, code, documents, designs, or inventions produced during the engagement.",
        "why_it_matters": "You might inadvertently give up ownership of your pre-existing work, tools, or side projects without realizing it.",
        "consideration": "Ensure prior inventions and tools are explicitly excluded from assignment.",
        "ask_lawyer": True,
    },
    "Renewal": {
        "keywords": ["renewal", "auto-renewal", "automatic extension", "evergreen", "term of agreement"],
        "regex": r"(?:automatic renewal|automatically renew|successive terms|term shall commence|evergreen)",
        "explanation": "States whether the contract automatically renews unless notice is given before a strict deadline.",
        "why_it_matters": "Missing the non-renewal notice window can trap you in another full contract term and financial obligation.",
        "consideration": "Put a reminder on your calendar 60 to 90 days before the renewal deadline.",
        "ask_lawyer": False,
    },
    "Warranties": {
        "keywords": ["warranty", "warranties", "as-is", "disclaimer", "merchantability", "fitness for a particular purpose"],
        "regex": r"(?:warranties|disclaims all warranties|as is, where is|merchantability|fitness for particular purpose)",
        "explanation": "Defines promises made about the quality of the service/goods, or disclaims all guarantees.",
        "why_it_matters": "If provided 'as-is' without warranties, you have very little recourse if the product or property is defective.",
        "consideration": "Look for express representations of quality, safety, and compliance with laws.",
        "ask_lawyer": False,
    },
    "Notice": {
        "keywords": ["notices", "written notice", "certified mail", "delivery of notice", "effective upon receipt"],
        "regex": r"(?:all notices shall be in writing|certified mail|registered mail|overnight courier|deemed given)",
        "explanation": "Sets formal rules for how legal notices (like termination or breach) must be delivered.",
        "why_it_matters": "Sending an email might not legally count if the contract requires certified mail or courier delivery.",
        "consideration": "Ensure modern electronic notices (email) are explicitly permitted.",
        "ask_lawyer": False,
    }
}


class ClauseClassifier:
    """Identifies and classifies clauses from document chunks using hybrid NLP heuristics."""

    @classmethod
    def classify_chunks(cls, chunks: List[DocumentChunk]) -> List[ClauseItem]:
        """Process chunks and extract structured clause items."""
        classified_clauses: List[ClauseItem] = []
        seen_categories = set()

        for chunk in chunks:
            chunk_lower = chunk.text.lower()
            section_lower = chunk.section_title.lower()

            for category, config in CLAUSE_PATTERNS.items():
                # Score pattern match
                keyword_hits = sum(1 for kw in config["keywords"] if kw in chunk_lower or kw in section_lower)
                regex_hit = bool(re.search(config["regex"], chunk_lower, re.IGNORECASE))

                if keyword_hits >= 2 or regex_hit:
                    # Clean excerpt (first 350 chars of relevant portion)
                    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", chunk.text) if s.strip()]
                    relevant_sentences = []
                    for s in sentences:
                        s_lower = s.lower()
                        if any(kw in s_lower for kw in config["keywords"]) or re.search(config["regex"], s_lower, re.IGNORECASE):
                            relevant_sentences.append(s)
                            if len(" ".join(relevant_sentences)) > 300:
                                break

                    excerpt = " ".join(relevant_sentences) if relevant_sentences else chunk.text[:350]
                    if len(excerpt) > 400:
                        excerpt = excerpt[:400] + "..."

                    title = chunk.section_title if chunk.section_title != f"Page {chunk.page_number}" else f"{category} Provision"
                    if len(title) > 60:
                        title = f"{category} Terms"

                    # Calculate confidence
                    confidence = min(0.70 + (keyword_hits * 0.08) + (0.15 if regex_hit else 0.0), 0.98)

                    # Deduplicate multiple chunks matching same category unless substantially different
                    cat_key = f"{category}_{chunk.page_number}"
                    if cat_key in seen_categories and len(classified_clauses) > 10:
                        continue
                    seen_categories.add(cat_key)

                    clause = ClauseItem(
                        clause_id=f"clause_{category.lower()}_{uuid.uuid4().hex[:6]}",
                        category=category,
                        title=title,
                        excerpt=excerpt,
                        page_number=chunk.page_number,
                        section_title=chunk.section_title,
                        plain_language_explanation=config["explanation"],
                        why_it_matters=config["why_it_matters"],
                        potential_consideration=config["consideration"],
                        confidence=round(confidence, 2),
                        ask_a_lawyer=config["ask_lawyer"],
                    )
                    classified_clauses.append(clause)

        # Fallback if few clauses found: extract general provisions
        if not classified_clauses and chunks:
            classified_clauses.append(
                ClauseItem(
                    clause_id=f"clause_general_{uuid.uuid4().hex[:6]}",
                    category="General Terms",
                    title="General Provisions",
                    excerpt=chunks[0].text[:300],
                    page_number=chunks[0].page_number,
                    section_title=chunks[0].section_title,
                    plain_language_explanation="General terms governing the contractual relationship between the parties.",
                    why_it_matters="All contractual terms define legal rights, remedies, and duties.",
                    potential_consideration="Review full document carefully for specific commitments.",
                    confidence=0.75,
                    ask_a_lawyer=False,
                )
            )

        return classified_clauses
