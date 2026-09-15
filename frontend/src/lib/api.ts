const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export function getValidToken(): string | null {
  if (typeof window === 'undefined') return null;
  let token = localStorage.getItem('r2r_token');
  if (!token) return null;
  token = token.replace(/^"|"$/g, '').trim();
  if (token.startsWith('Bearer ')) {
    token = token.substring(7).trim();
  }
  if (!token || token === 'null' || token === 'undefined') return null;
  return token;
}

export function handleUnauthorizedResponse() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('r2r_token');
  localStorage.removeItem('r2r_user');
  window.dispatchEvent(new Event('r2r_unauthorized'));
  const currentPath = window.location.pathname;
  if (!['/login', '/register', '/'].includes(currentPath)) {
    window.location.href = '/login';
  }
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getValidToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (
      res.status === 401 ||
      data.error?.code === 'UNAUTHORIZED' ||
      (data.error?.message && (
        data.error.message.includes('token') ||
        data.error.message.includes('Unauthorized') ||
        data.error.message.includes('jwt')
      ))
    ) {
      handleUnauthorizedResponse();
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: err.message || 'Failed to connect to backend server',
      },
    };
  }
}

export const api = {
  // Health Check
  getHealth: () => request('/health'),
  getApiHealth: async () => {
    try {
      const healthUrl = API_BASE.endsWith('/v1') 
        ? API_BASE.slice(0, -3) + '/health' 
        : API_BASE.replace(/\/v1\/?$/, '') + '/health';
      const res = await fetch(healthUrl);
      return await res.json();
    } catch (err: any) {
      return { success: false, status: 'error', message: err.message };
    }
  },

  // Auth
  login: (data: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request('/auth/profile'),
  updateProfile: (data: any) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Papers
  searchPapers: (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return request(`/papers?${query}`);
  },
  getPaperById: (id: string) => request(`/papers/${id}`),
  toggleBookmark: (paperId: string) => request('/papers/bookmark', { method: 'POST', body: JSON.stringify({ paperId }) }),
  chatWithPaper: (data: { paperId?: string; message: string }) => request('/papers/chat', { method: 'POST', body: JSON.stringify(data) }),

  // Analysis & Gaps
  analyzePaper: (data: any) => request('/analysis/analyze', { method: 'POST', body: JSON.stringify(data) }),
  uploadPDF: async (file: File | { fileName: string }) => {
    if (file instanceof File) {
      const token = getValidToken();
      const formData = new FormData();
      formData.append('file', file);

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const res = await fetch(`${API_BASE}/analysis/upload-pdf`, {
          method: 'POST',
          headers,
          body: formData
        });
        const data = await res.json();
        if (
          res.status === 401 ||
          data.error?.code === 'UNAUTHORIZED' ||
          (data.error?.message && (
            data.error.message.includes('token') ||
            data.error.message.includes('Unauthorized') ||
            data.error.message.includes('jwt')
          ))
        ) {
          handleUnauthorizedResponse();
        }
        return data;
      } catch (err: any) {
        return {
          success: false,
          error: { code: 'UPLOAD_ERROR', message: err.message || 'Failed to upload PDF' }
        };
      }
    }
    return request('/analysis/upload-pdf', { method: 'POST', body: JSON.stringify(file) });
  },
  analyzeGaps: (data: any) => request('/gaps/analyze', { method: 'POST', body: JSON.stringify(data) }),
  getGaps: (paperId?: string) => request(`/gaps?paperId=${paperId || ''}`),

  // Innovation & Novelty
  generateInnovation: (data: any) => request('/innovations/generate', { method: 'POST', body: JSON.stringify(data) }),
  getInnovation: (paperId?: string, projectId?: string) => request(`/innovations?paperId=${paperId || ''}&projectId=${projectId || ''}`),
  checkNovelty: (data: any) => request('/innovations/check-novelty', { method: 'POST', body: JSON.stringify(data) }),

  // Projects CRUD
  createProject: (data: any) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  getProjects: () => request('/projects'),
  getProjectById: (id: string) => request(`/projects/${id}`),
  updateProject: (id: string, data: any) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) => request(`/projects/${id}`, { method: 'DELETE' }),

  // Recommendations
  getDatasets: (domain?: string, paperId?: string) => request(`/recommendations/datasets?domain=${encodeURIComponent(domain || '')}&paperId=${paperId || ''}`),
  getAlgorithms: (category?: string, paperId?: string) => request(`/recommendations/algorithms?category=${encodeURIComponent(category || '')}&paperId=${paperId || ''}`),
  getTechStack: (paperId?: string) => request(`/recommendations/tech-stack?paperId=${paperId || ''}`),

  // Generation Modules
  generateExperiment: (data: any) => request('/experiments/generate', { method: 'POST', body: JSON.stringify(data) }),
  getExperiment: (projectId?: string, paperId?: string) => request(`/experiments?projectId=${projectId || ''}&paperId=${paperId || ''}`),

  generateCode: (data: any) => request('/code/generate', { method: 'POST', body: JSON.stringify(data) }),
  getCode: (projectId?: string, paperId?: string) => request(`/code?projectId=${projectId || ''}&paperId=${paperId || ''}`),

  getRoadmap: (projectId?: string, paperId?: string) => request(`/roadmaps?projectId=${projectId || ''}&paperId=${paperId || ''}`),

  generateStartup: (data: any) => request('/startups/generate', { method: 'POST', body: JSON.stringify(data) }),
  getStartup: (paperId?: string, projectId?: string) => request(`/startups?paperId=${paperId || ''}&projectId=${projectId || ''}`),

  generateReport: (data: any) => request('/reports/generate', { method: 'POST', body: JSON.stringify(data) }),
  getReport: (paperId?: string, projectId?: string) => request(`/reports?paperId=${paperId || ''}&projectId=${projectId || ''}`),

  generateLitReview: (data: any) => request('/litreview/generate', { method: 'POST', body: JSON.stringify(data) }),
  getLitReview: (paperId?: string) => request(`/litreview?paperId=${paperId || ''}`),

  // Patents & Admin
  searchPatents: (query?: string, paperId?: string) => request(`/patents?query=${encodeURIComponent(query || '')}&paperId=${paperId || ''}`),
  getAdminStats: () => request('/admin/stats'),
};
