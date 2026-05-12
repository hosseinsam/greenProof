export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('greenproof_token') : null;
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(options.headers || {}),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' })
  } as Record<string, string>;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
    body: options.body
  });
  return response.json();
}
