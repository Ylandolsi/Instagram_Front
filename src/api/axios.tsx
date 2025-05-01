import axios from "axios";
import { AxiosError } from "axios";
export const API_URL = "http://localhost:5068/api";
export const URL = "http://localhost:5068";
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // for cookies to be sent with requests automatically
  withCredentials: true,
});

// only the first request will triger the refresh
let isRefreshing = false;
let failedQueue: any = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config; // error.config contains all info needed to replay the request

    // If not authorized and we didnt retry refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // if we are already refreshing, return a promise that will be resolved when the refresh is done
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }) // create promise in the queue
          .then(() => {
            return api(originalRequest); // when the promise is resolved , we will
            // retry the original request
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${API_URL}/Account/refresh`,
          {},
          { withCredentials: true }
        );

        // Refresh successful, retry original request
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        processQueue(refreshError, null);

        // logout
        try {
          await axios.post(
            `${API_URL}/auth/logout`,
            {},
            { withCredentials: true }
          );
          localStorage.setItem("Auth", "false");
        } catch (logoutError) {
          console.error("Logout failed", logoutError);
        } finally {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export interface ErrorAxios {
  message: string;
  code?: string;
  field?: string;
}

export const handleError = (error: any): ErrorAxios => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    if (axiosError.response) {
      const status = axiosError.response.status;
      const responseData = axiosError.response.data;

      return {
        message:
          responseData.message || "An error occurred during authentication",
        code: `HTTP_${status}`,
      };
    }

    // Network errors
    if (axiosError.request && !axiosError.response) {
      return {
        message: "Network error. Please check your connection and try again",
        code: "NETWORK_ERROR",
      };
    }
  }

  //  fallback for non-axios errors
  return {
    message: error.message || "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
  };
};

export default api;
