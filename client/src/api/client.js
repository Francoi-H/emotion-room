import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const register = (email, password) =>
  api.post('/auth/register', { email, password }).then(r => r.data);

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then(r => r.data);

export const logout = () =>
  api.post('/auth/logout').then(r => r.data);

export const getMe = () =>
  api.get('/auth/me').then(r => r.data);

// ── Environments ──────────────────────────────────────────────────────────────
export const getEmotionDefaults = () =>
  api.get('/environments/defaults').then(r => r.data);

export const getEmotionDefault = (emotion) =>
  api.get(`/environments/defaults/${emotion}`).then(r => r.data);

export const saveEnvironment = (payload) =>
  api.post('/environments', payload).then(r => r.data);

export const listEnvironments = () =>
  api.get('/environments').then(r => r.data);

export const getEnvironment = (id) =>
  api.get(`/environments/${id}`).then(r => r.data);

export const updateEnvironment = (id, payload) =>
  api.patch(`/environments/${id}`, payload).then(r => r.data);

export const deleteEnvironment = (id) =>
  api.delete(`/environments/${id}`).then(r => r.data);

export default api;
