const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

const buildUrl = (endpoint = '') => {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalized}`;
};

export const unwrapApiResponse = (payload) => {
  const envelope = payload?.data ?? payload;

  if (envelope && typeof envelope === 'object' && Object.prototype.hasOwnProperty.call(envelope, 'success')) {
    if (!envelope.success) {
      throw new Error(envelope?.message || 'Request failed');
    }
    return envelope.data;
  }

  return envelope;
};

const parseResponse = async (response) => {
  let data = {};
  try {
    data = await response.json();
  } catch {
    // ignore
  }

  if (!response.ok) {
    const error = new Error(data?.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return unwrapApiResponse(data);
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = buildUrl(endpoint);
  const token = getToken();
  const skipAuth = options.skipAuth === true;
  const headers = {
    'Content-Type': 'application/json',
    ...(!skipAuth && token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const { skipAuth: _skipAuth, ...restOptions } = options;
  const response = await fetch(url, {
    ...restOptions,
    headers,
  });
  return parseResponse(response);
};

export const getApiBaseUrl = () => API_BASE_URL;
export { getToken, setToken, removeToken };
