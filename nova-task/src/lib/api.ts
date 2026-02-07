import { AuthResponse, LoginRequest, RegisterRequest, Task, TaskRequest } from '@/types/task';

// ⚙️ Change this to your Spring Boot backend URL
const API_BASE_URL = 'http://localhost:8080/api';

function getToken(): string | null {
  return localStorage.getItem('taskflow_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorBody.error || errorMessage;
    } catch {
      // Response body is not JSON
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) return null as T;

  const text = await response.text();
  return text ? JSON.parse(text) : (null as T);
}

// ─── Authentication ───────────────────────────────────────────────

export const authApi = {
  /** POST /api/auth/register */
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** POST /api/auth/login */
  login: (data: LoginRequest): Promise<AuthResponse> =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── Tasks ────────────────────────────────────────────────────────

export const tasksApi = {
  /** GET /api/tasks */
  getAll: (): Promise<Task[]> => request<Task[]>('/tasks'),

  /** GET /api/tasks/:id */
  getById: (id: number): Promise<Task> => request<Task>(`/tasks/${id}`),

  /** POST /api/tasks */
  create: (data: TaskRequest): Promise<Task> =>
    request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** PUT /api/tasks/:id */
  update: (id: number, data: TaskRequest): Promise<Task> =>
    request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** DELETE /api/tasks/:id */
  delete: (id: number): Promise<{ message: string }> =>
    request<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};
