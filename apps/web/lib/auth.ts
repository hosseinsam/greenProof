export function saveSession(token: string, user: any) {
  localStorage.setItem('greenproof_token', token);
  localStorage.setItem('greenproof_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('greenproof_token');
  localStorage.removeItem('greenproof_user');
}

export function getSession() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('greenproof_user');
  return user ? JSON.parse(user) : null;
}
