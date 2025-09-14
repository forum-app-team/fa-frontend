import axios from "axios";
import { API_CONFIG } from "../config/api.config";
import { loginSuccess, logout } from "../features/auth/store/auth.slice";
import { store } from "../store/store";

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// ! Dev mode flag
const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === "true";

// Auth interceptor for requests
apiClient.interceptors.request.use((config) => {
  // Skip auth check in development mode
  if (SKIP_AUTH) {
    return config;
  }
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.withCredentials = true;
  return config;
});

// Auth interceptor for responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.warn("API Error:", error);

    const status = error?.response?.status;
    const config = error?.config;

    // only handle 401 once per request
    if (config && status === 401 && !config._retry && !SKIP_AUTH)
      return await handle401(error);

    return Promise.reject(error);
  }
);


// Separate client for reactive refresh
export const refreshClient = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

// refresh state
let isRefreshing = false;
const waiters = [];

const notifyAll = (token) => {
  waiters.forEach((cb) => cb(token));
  waiters.length = 0;
};

const queueForRefresh = () =>
  new Promise((resolve) => {
    waiters.push((token) => resolve(token));
  });

const handle401 = async (error) => {
  const config = error.config;
  config._retry = true;

  // If a refresh is already running, wait for it, then retry
  if (isRefreshing) {
    const token = await queueForRefresh();
    if (!token) return Promise.reject(error); // refresh failed elsewhere
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    return apiClient(config);
  }

  // Start a new refresh
  isRefreshing = true;
  try {
    const { data } = await refreshClient.post(
      '',
      {},
      { withCredentials: true } // cookie carries refresh token
    );
    const newAccess = data?.accessToken;

    if (!newAccess) {
      // Unexpected payload -> treat as failure
      store.dispatch(logout({message: "Failed to get new access token"}));
      notifyAll(null);
      return Promise.reject(error);
    }

    // Update Redux store
    store.dispatch(loginSuccess(data));
    notifyAll(newAccess);

    // Retry original with new token
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${newAccess}`;
    return apiClient(config);

  } catch (e) {
    // Refresh failed -> logout and reject everyone
    store.dispatch(logout({message: "Failed to refresh"}));
    notifyAll(null);
    return Promise.reject(e);
  } finally {
    isRefreshing = false;
  }
};

export default apiClient;
