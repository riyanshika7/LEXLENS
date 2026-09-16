"""In-memory Okapi BM25 and keyword index for grounded citation retrieval."""

import math
import re
from collections import Counter, defaultdict
from typing import Dict, List, Tuple
from backend.schemas.document import DocumentChunk


STOP_WORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
    "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
    "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
    "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
    "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
    "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
    "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
    "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
    "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
    "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
    "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
    "they've", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
    "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
    "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
    "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
    "yourself", "yourselves"
}


def tokenize(text: str) -> List[str]:
    """Tokenize and normalize text into clean lowercase words without stopwords."""
    words = re.findall(r"\b[a-zA-Z0-9_\-]{2,}\b", text.lower())
    return [w for w in words if w not in STOP_WORDS]


class BM25Retriever:
    """Okapi BM25 in-memory search index over document chunks."""

    def __init__(self, chunks: List[DocumentChunk], k1: float = 1.5, b: float = 0.75):
        self.chunks = chunks
        self.k1 = k1
        self.b = b
        self.doc_count = len(chunks)
        self.doc_lengths: List[int] = []
        self.doc_term_freqs: List[Counter] = []
        self.inverted_index: Dict[str, List[int]] = defaultdict(list)
        self.avg_doc_len = 0.0

        self._build_index()

    def _build_index(self):
        """Construct inverted index and calculate length statistics."""
        if not self.chunks:
            return

        total_length = 0
        for idx, chunk in enumerate(self.chunks):
            # Include section title in search tokens with double weight
            tokens = tokenize(chunk.section_title) * 2 + tokenize(chunk.text)
            length = len(tokens)
            self.doc_lengths.append(length)
            total_length += length

            tf = Counter(tokens)
            self.doc_term_freqs.append(tf)

            for term in tf.keys():
                self.inverted_index[term].append(idx)

        self.avg_doc_len = total_length / max(self.doc_count, 1)

    def _idf(self, term: str) -> float:
        """Compute Robertson-Spärck Jones inverse document frequency."""
        df = len(self.inverted_index.get(term, []))
        if df == 0:
            return 0.0
        return math.log((self.doc_count - df + 0.5) / (df + 0.5) + 1.0)

    def retrieve(self, query: str, top_k: int = 5) -> List[Tuple[DocumentChunk, float]]:
        """
        Rank chunks against user query using BM25 with exact-phrase boosting.
        Returns Top-K (DocumentChunk, score) tuples.
        """
        if not self.chunks:
            return []

        query_tokens = tokenize(query)
        if not query_tokens:
            # If all stopwords or empty, return first chunks
            return [(self.chunks[i], 0.1) for i in range(min(top_k, len(self.chunks)))]

        scores: Dict[int, float] = defaultdict(float)

        # 1. BM25 scoring for individual terms
        for term in query_tokens:
            matching_doc_ids = self.inverted_index.get(term, [])
            idf_val = self._idf(term)

            for doc_id in matching_doc_ids:
                tf = self.doc_term_freqs[doc_id][term]
                doc_len = self.doc_lengths[doc_id]
                denominator = tf + self.k1 * (1.0 - self.b + self.b * (doc_len / max(self.avg_doc_len, 1.0)))
                scores[doc_id] += idf_val * (tf * (self.k1 + 1.0)) / max(denominator, 0.0001)

        # 2. Phrase matching bonus
        clean_query = query.lower().strip()
        if len(clean_query) > 5:
            for doc_id, chunk in enumerate(self.chunks):
                if clean_query in chunk.text.lower():
                    scores[doc_id] += 3.0  # Big boost for literal phrase presence

        if not scores:
            return []

        # Sort descending by score
        ranked_indices = sorted(scores.keys(), key=lambda idx: scores[idx], reverse=True)[:top_k]
        return [(self.chunks[idx], round(scores[idx], 4)) for idx in ranked_indices]
