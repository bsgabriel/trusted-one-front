import type { ProblemDetail } from 'src/types/api';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { defineBoot } from '#q-app/wrappers';
import axios from 'axios';
import { apiService } from 'src/services/apiUtils';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = apiService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error as Error),
);

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const problemDetail = error.response?.data as ProblemDetail;
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (problemDetail?.errorCode === 'INVALID_CREDENTIALS') {
      return Promise.reject(error);
    }

    if (status === 401 && problemDetail?.errorCode === 'SESSION_EXPIRED') {
      apiService.clearTokens();
      window.dispatchEvent(new CustomEvent('session-expired'));
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/refresh')) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post('/user/refresh', {
          refreshToken: apiService.getRefreshToken(),
        });

        apiService.setTokens(data.accessToken, data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (e) {
        return Promise.reject(e as Error);
      }
    }

    return Promise.reject(error);
  },
);

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
