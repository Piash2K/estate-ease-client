const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://estate-ease-server.vercel.app';

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

  return data;
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = buildUrl(endpoint);
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const response = await fetch(url, {
    ...options,
    headers,
  });
  return parseResponse(response);
};

export const getApiBaseUrl = () => API_BASE_URL;
export { getToken, setToken, removeToken };
