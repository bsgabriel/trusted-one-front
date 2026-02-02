import type { InternalAxiosRequestConfig, AxiosError, AxiosInstance } from 'axios';
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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

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
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/login') &&
      !originalRequest.url?.includes('/refresh')
    ) {

      const problemDetail = error.response?.data as { errorCode?: string };

      if (problemDetail?.errorCode === 'INVALID_CREDENTIALS') {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err as Error));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = apiService.getRefreshToken();

      if (!refreshToken) {
        apiService.clearTokens();
        window.dispatchEvent(new CustomEvent('session-expired'));
        isRefreshing = false;
        return Promise.reject(error as Error);
      }

      try {
        const response = await axios.post(`${api.defaults.baseURL}/user/refresh`, { refreshToken });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        apiService.setTokens(accessToken, newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue();

        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        apiService.clearTokens();
        window.dispatchEvent(new CustomEvent('session-expired'));
        isRefreshing = false;
        return Promise.reject(refreshError as Error);
      }
    }
    return Promise.reject(error as Error);
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
