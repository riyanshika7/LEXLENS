"""Semantic document comparison engine detecting added, removed, and modified clauses."""

import re
from typing import Dict, List, Set, Tuple
from backend.schemas.analysis import ClauseItem
from backend.schemas.compare import ClauseDiff, ComparisonResult
from backend.schemas.document import DocumentContent
from backend.services.clause_classifier import ClauseClassifier


def compute_jaccard_similarity(text1: str, text2: str) -> float:
    """Calculate token-level Jaccard similarity between two texts."""
    words1 = set(re.findall(r"\b\w{3,}\b", text1.lower()))
    words2 = set(re.findall(r"\b\w{3,}\b", text2.lower()))
    if not words1 and not words2:
        return 1.0
    if not words1 or not words2:
        return 0.0
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    return len(intersection) / len(union)


def extract_numbers_and_dollars(text: str) -> Set[str]:
    """Find dollar amounts and numerical counts in text."""
    return set(re.findall(r"\$[\d,]+|\b\d+\s+(?:days|months|years|percent|%|hours)\b", text.lower()))


class DocumentComparator:
    """Performs semantic version comparison between two legal documents."""

    @classmethod
    def compare_documents(
        cls, doc1: DocumentContent, doc2: DocumentContent
    ) -> ComparisonResult:
        """Compare Version 1 (baseline) and Version 2 (revised)."""
        clauses1 = ClauseClassifier.classify_chunks(doc1.chunks)
        clauses2 = ClauseClassifier.classify_chunks(doc2.chunks)

        map1: Dict[str, ClauseItem] = {c.category: c for c in clauses1}
        map2: Dict[str, ClauseItem] = {c.category: c for c in clauses2}

        all_categories = set(map1.keys()).union(set(map2.keys()))

        changed_clauses: List[ClauseDiff] = []
        total_added = 0
        total_removed = 0
        total_modified = 0

        changed_obligations: List[str] = []
        changed_dates: List[str] = []
        changed_payment_terms: List[str] = []

        for category in sorted(all_categories):
            in_doc1 = category in map1
            in_doc2 = category in map2

            if in_doc2 and not in_doc1:
                # Added clause
                total_added += 1
                c2 = map2[category]
                diff = ClauseDiff(
                    category=category,
                    title=c2.title,
                    status="added",
                    old_text=None,
                    new_text=c2.excerpt,
                    semantic_change_summary=f"New {category} clause added in updated version. {c2.why_it_matters}",
                    obligation_shift=f"Imposes new {category} duties not present in the original document.",
                    risk_delta="increased" if c2.ask_a_lawyer else "neutral",
                )
                changed_clauses.append(diff)
                changed_obligations.append(f"Added obligation under {category}: {c2.plain_language_explanation}")

            elif in_doc1 and not in_doc2:
                # Removed clause
                total_removed += 1
                c1 = map1[category]
                diff = ClauseDiff(
                    category=category,
                    title=c1.title,
                    status="removed",
                    old_text=c1.excerpt,
                    new_text=None,
                    semantic_change_summary=f"The {category} clause from the original document was deleted.",
                    obligation_shift=f"Removes previous rights or obligations under {category}.",
                    risk_delta="increased" if category in ["Warranties", "Liability"] else "neutral",
                )
                changed_clauses.append(diff)
                changed_obligations.append(f"Removed former protections under {category}.")

            else:
                # Both have this category: check similarity
                c1 = map1[category]
                c2 = map2[category]
                sim = compute_jaccard_similarity(c1.excerpt, c2.excerpt)

                # Check for numerical / term shifts
                num1 = extract_numbers_and_dollars(c1.excerpt)
                num2 = extract_numbers_and_dollars(c2.excerpt)
                num_diff = num1.symmetric_difference(num2)

                if sim < 0.85 or num_diff:
                    total_modified += 1
                    risk_delta = "neutral"
                    notes = []

                    if num_diff:
                        notes.append(f"Numerical terms changed (e.g., {', '.join(list(num_diff)[:3])}).")
                    if category == "Payment":
                        changed_payment_terms.append(f"Payment terms altered in {c2.title}: {c2.excerpt[:120]}...")
                        risk_delta = "increased"
                    elif category == "Termination":
                        changed_dates.append(f"Termination conditions or notice periods changed: {c2.excerpt[:120]}...")
                    elif category in ["Indemnification", "Liability"]:
                        risk_delta = "increased"

                    summary_note = " ".join(notes) if notes else "Wording has been substantially updated."

                    diff = ClauseDiff(
                        category=category,
                        title=c2.title,
                        status="modified",
                        old_text=c1.excerpt,
                        new_text=c2.excerpt,
                        semantic_change_summary=f"Substantial modifications detected in {category}. {summary_note}",
                        obligation_shift="Modified covenants alter the balance of rights between the parties.",
                        risk_delta=risk_delta,
                    )
                    changed_clauses.append(diff)

        exec_summary = (
            f"Comparison between '{doc1.metadata.filename}' and '{doc2.metadata.filename}': "
            f"{total_added} clause(s) added, {total_removed} removed, and {total_modified} modified. "
        )
        if total_modified > 0:
            exec_summary += "Significant changes were detected in obligations and risk provisions that warrant legal consultation."
        else:
            exec_summary += "Documents are broadly consistent with minor textual differences."

        return ComparisonResult(
            doc1_id=doc1.metadata.doc_id,
            doc2_id=doc2.metadata.doc_id,
            doc1_name=doc1.metadata.filename,
            doc2_name=doc2.metadata.filename,
            executive_summary=exec_summary,
            total_added=total_added,
            total_removed=total_removed,
            total_modified=total_modified,
            changed_clauses=changed_clauses,
            changed_obligations=changed_obligations[:6],
            changed_dates=changed_dates[:6],
            changed_payment_terms=changed_payment_terms[:6],
        )
