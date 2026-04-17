import { getIdToken } from 'firebase/auth';
import auth from '../Components/Firebase/firebase.config';

const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

const TOKEN_STORAGE_KEY = 'token';

const getToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);
const setToken = (token) => localStorage.setItem(TOKEN_STORAGE_KEY, token);
const removeToken = () => localStorage.removeItem(TOKEN_STORAGE_KEY);

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

const parseResponse = async (response, options = {}) => {
  let data = {};
  try {
    data = await response.json();
  } catch {
    // ignore
  }

  if (response.status === 404 && options.allowNotFound) {
    return null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return unwrapApiResponse(data);
};

const getAuthToken = async ({ forceRefresh = false } = {}) => {
  if (auth.currentUser) {
    try {
      return await getIdToken(auth.currentUser, forceRefresh);
    } catch (error) {
      console.warn('Failed to read Firebase auth token, falling back to stored token.', error);
    }
  }

  return getToken();
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = buildUrl(endpoint);
  const skipAuth = options.skipAuth === true;
  const requestOptions = { ...options };
  delete requestOptions.skipAuth;
  delete requestOptions.allowNotFound;
  const token = skipAuth ? null : await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(!skipAuth && token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  let response = await fetch(url, {
    ...requestOptions,
    headers,
  });

  if (!skipAuth && response.status === 401 && auth.currentUser) {
    const refreshedToken = await getAuthToken({ forceRefresh: true });
    response = await fetch(url, {
      ...requestOptions,
      headers: {
        ...headers,
        ...(refreshedToken && { Authorization: `Bearer ${refreshedToken}` }),
      },
    });
  }

  return parseResponse(response, options);
};

export const getApiBaseUrl = () => API_BASE_URL;
export const extractTokenFromResponse = (payload) => (
  payload?.token ||
  payload?.accessToken ||
  payload?.jwt ||
  payload?.access_token ||
  null
);
export { getToken, setToken, removeToken };
