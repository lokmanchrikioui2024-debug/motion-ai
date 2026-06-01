import type { User, Project, Template, Asset, PricingPlan, Notification, AnalyticsStat, ChartData } from "@/types";

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem('access_token', token);
  else localStorage.removeItem('access_token');
}

async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = (opts.headers as any) || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Accept'] = 'application/json';
  if (opts.body && !(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const res = await fetch(`/api${path}`, { ...opts, headers, credentials: 'same-origin' });
  const txt = await res.text();
  let json: any = null;
  try { json = txt ? JSON.parse(txt) : null; } catch { json = txt; }
  if (!res.ok) throw { status: res.status, body: json || txt };
  return json;
}

export async function login(email: string, password: string) {
  const body = { email, password };
  const res = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) });
  if (res.access_token) setToken(res.access_token);
  return res;
}

export function logout() {
  setToken(null);
}

export async function register(email: string, password: string) {
  const res = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
  return res;
}

export async function apiGet(path: string) { return apiFetch(path, { method: 'GET' }); }
export async function apiPost(path: string, data: any) { return apiFetch(path, { method: 'POST', body: JSON.stringify(data) }); }
export async function apiPostForm(path: string, form: FormData) { return apiFetch(path, { method: 'POST', body: form }); }

export async function fetchUser(): Promise<User> {
  const data = await apiGet('/auth/me');
  return data.user ?? data;
}

export async function fetchProjects(): Promise<Project[]> {
  const data = await apiGet('/projects');
  return data.projects ?? data;
}

export async function fetchTemplates(): Promise<Template[]> {
  const data = await apiGet('/templates');
  return data.templates ?? data;
}

export async function fetchAssets(): Promise<Asset[]> {
  const data = await apiGet('/assets');
  return data.assets ?? data;
}

export async function fetchPricingPlans(): Promise<PricingPlan[]> {
  const data = await apiGet('/subscriptions/plans');
  return data.plans ?? data;
}

export async function fetchNotifications(): Promise<Notification[]> {
  const data = await apiGet('/public/notifications');
  return data.notifications ?? data;
}

export async function fetchAnalytics(): Promise<AnalyticsStat[]> {
  const data = await apiGet('/analytics/overview');
  return data.stats ?? data;
}

export async function fetchChartData(): Promise<ChartData[]> {
  const data = await apiGet('/analytics/chart');
  return data.chart ?? data;
}

export async function fetchTestimonials() {
  const data = await apiGet('/public/testimonials');
  return data.testimonials ?? data;
}

export async function fetchFaqs() {
  const data = await apiGet('/public/faqs');
  return data.faqs ?? data;
}

export default {
  login,
  logout,
  register,
  setToken,
  apiGet,
  apiPost,
  apiPostForm,
  fetchUser,
  fetchProjects,
  fetchTemplates,
  fetchAssets,
  fetchPricingPlans,
  fetchNotifications,
  fetchAnalytics,
  fetchChartData,
  fetchTestimonials,
  fetchFaqs,
};
