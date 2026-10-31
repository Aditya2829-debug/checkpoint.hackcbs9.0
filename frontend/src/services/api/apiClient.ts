import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './endpoints';
import { handleAxiosError } from './apiErrors';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to attach bearer token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('checkpoint_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = handleAxiosError(error);
    return Promise.reject(apiError);
  }
);

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}
