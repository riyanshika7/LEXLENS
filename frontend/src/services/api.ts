import {
  BenchmarkDoc,
  ChecklistItem,
  ChecklistResponse,
  ComparisonResult,
  DocumentAnalysisResponse,
  DocumentContent,
  GroundedAnswer,
  LawyerBrief,
  SandboxRunResponse,
} from '../types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = 'An unexpected server error occurred.';
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || errorJson.message || errorDetail;
    } catch {
      errorDetail = `Request failed with status ${res.status} (${res.statusText})`;
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

export const api = {
  async uploadDocument(
    file: File,
    country: string = 'United States',
    state: string = 'General'
  ): Promise<DocumentAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jurisdiction_country', country);
    formData.append('jurisdiction_state', state);

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<DocumentAnalysisResponse>(res);
  },

  async getDocument(docId: string): Promise<DocumentContent> {
    const res = await fetch(`${API_BASE}/documents/${docId}`);
    return handleResponse<DocumentContent>(res);
  },

  async getAnalysis(docId: string): Promise<DocumentAnalysisResponse> {
    const res = await fetch(`${API_BASE}/analysis/${docId}`);
    return handleResponse<DocumentAnalysisResponse>(res);
  },

  async askCopilot(
    docId: string,
    question: string,
    country?: string,
    state?: string
  ): Promise<GroundedAnswer> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doc_id: docId,
        question,
        jurisdiction_country: country,
        jurisdiction_state: state,
      }),
    });
    return handleResponse<GroundedAnswer>(res);
  },

  async getChecklist(docId: string): Promise<ChecklistResponse> {
    const res = await fetch(`${API_BASE}/checklist/${docId}`);
    return handleResponse<ChecklistResponse>(res);
  },

  async toggleChecklistItem(itemId: string, completed: boolean): Promise<ChecklistItem> {
    const res = await fetch(`${API_BASE}/checklist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: itemId, completed }),
    });
    return handleResponse<ChecklistItem>(res);
  },

  async addCustomChecklistItem(
    docId: string,
    text: string,
    priority: string = 'medium',
    category: string = 'User Custom'
  ): Promise<ChecklistItem> {
    const res = await fetch(`${API_BASE}/checklist/custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc_id: docId, text, priority, category }),
    });
    return handleResponse<ChecklistItem>(res);
  },

  async getLawyerBrief(docId: string): Promise<LawyerBrief> {
    const res = await fetch(`${API_BASE}/lawyer-brief/${docId}`);
    return handleResponse<LawyerBrief>(res);
  },

  async updateBriefNotes(docId: string, notes: string): Promise<LawyerBrief> {
    const res = await fetch(`${API_BASE}/lawyer-brief/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc_id: docId, notes }),
    });
    return handleResponse<LawyerBrief>(res);
  },

  async compareDocuments(doc1Id: string, doc2Id: string): Promise<ComparisonResult> {
    const res = await fetch(`${API_BASE}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc1_id: doc1Id, doc2_id: doc2Id }),
    });
    return handleResponse<ComparisonResult>(res);
  },

  async getSandboxBenchmarks(): Promise<BenchmarkDoc[]> {
    const res = await fetch(`${API_BASE}/sandbox/benchmarks`);
    return handleResponse<BenchmarkDoc[]>(res);
  },

  async runSandboxBenchmark(benchmarkId: string): Promise<SandboxRunResponse> {
    const res = await fetch(`${API_BASE}/sandbox/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ benchmark_id: benchmarkId }),
    });
    return handleResponse<SandboxRunResponse>(res);
  },

  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse<any>(res);
  },
};
