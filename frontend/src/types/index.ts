export interface DocumentMetadata {
  doc_id: string;
  filename: string;
  file_type: string;
  size_bytes: number;
  page_count: number;
  word_count: number;
  created_at: string;
  jurisdiction_country: string;
  jurisdiction_state: string;
}

export interface DocumentChunk {
  chunk_id: string;
  page_number: number;
  section_title: string;
  text: string;
  char_start: number;
  char_end: number;
}

export interface DocumentContent {
  metadata: DocumentMetadata;
  raw_text: string;
  chunks: DocumentChunk[];
}

export interface ClauseItem {
  clause_id: string;
  category: string;
  title: string;
  excerpt: string;
  page_number: number;
  section_title: string;
  plain_language_explanation: string;
  why_it_matters: string;
  potential_consideration: string;
  confidence: number;
  ask_a_lawyer: boolean;
}

export interface ObligationItem {
  obligation_id: string;
  responsible_party: string;
  action: string;
  deadline_or_frequency: string;
  source_clause_title: string;
  page_number: number;
  excerpt: string;
}

export interface DeadlineItem {
  deadline_id: string;
  title: string;
  date_or_trigger: string;
  is_explicit: boolean;
  consequence: string;
  source_clause_title: string;
  page_number: number;
}

export interface PotentialConcern {
  concern_id: string;
  title: string;
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  document_excerpt: string;
  page_number: number;
  professional_review_advice: string;
}

export interface DocumentSummary {
  doc_type: string;
  purpose: string;
  parties: string[];
  jurisdiction_statement: string;
  important_dates: string[];
  key_obligations: string[];
  important_clauses: string[];
  potential_concerns: string[];
  missing_information: string[];
  questions_to_ask: string[];
  next_steps: string[];
}

export interface DocumentAnalysisResponse {
  metadata: DocumentMetadata;
  summary: DocumentSummary;
  clauses: ClauseItem[];
  obligations: ObligationItem[];
  deadlines: DeadlineItem[];
  concerns: PotentialConcern[];
}

export interface EvidenceCitation {
  chunk_id: string;
  page_number: number;
  section_title: string;
  exact_excerpt: string;
}

export interface GroundedAnswer {
  answer: string;
  document_evidence: EvidenceCitation[];
  explanation: string;
  uncertainty: string;
  next_step: string;
  confidence: number;
  is_found_in_document: boolean;
  legal_disclaimer: string;
}

export interface ChecklistItem {
  item_id: string;
  text: string;
  category: string;
  source_type: 'document_derived' | 'general_guidance';
  source_citation: string | null;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface ChecklistResponse {
  doc_id: string;
  items: ChecklistItem[];
}

export interface ClauseDiff {
  category: string;
  title: string;
  status: 'added' | 'removed' | 'modified' | 'unchanged';
  old_text: string | null;
  new_text: string | null;
  semantic_change_summary: string;
  obligation_shift: string | null;
  risk_delta: 'increased' | 'decreased' | 'neutral';
}

export interface ComparisonResult {
  doc1_id: string;
  doc2_id: string;
  doc1_name: string;
  doc2_name: string;
  executive_summary: string;
  total_added: number;
  total_removed: number;
  total_modified: number;
  changed_clauses: ClauseDiff[];
  changed_obligations: string[];
  changed_dates: string[];
  changed_payment_terms: string[];
}

export interface LawyerBrief {
  doc_id: string;
  document_title: string;
  doc_type: string;
  parties: string[];
  jurisdiction: string;
  executive_summary: string;
  key_facts_to_verify: string[];
  high_priority_clauses: ClauseItem[];
  questions_for_lawyer: string[];
  documents_to_bring: string[];
  uncertainties: string[];
  user_notes: string;
  generated_at: string;
}

export interface BenchmarkDoc {
  benchmark_id: string;
  title: string;
  category: string;
  description: string;
  filename: string;
  sample_questions: string[];
}

export interface DiagnosticReport {
  doc_id: string;
  parse_time_ms: number;
  analysis_time_ms: number;
  total_time_ms: number;
  chunk_count: number;
  word_count: number;
  clause_count: number;
  concern_count: number;
  retrieval_p50_ms: number;
  security_checks_passed: boolean;
  status: string;
  error_details: string | null;
}

export interface SandboxRunResponse {
  benchmark: BenchmarkDoc;
  diagnostic: DiagnosticReport;
  sample_answers: Array<{
    question: string;
    answer: string;
    evidence_count: number;
    citations: string[];
    confidence: number;
    latency_ms: number;
  }>;
  system_status: string;
}
