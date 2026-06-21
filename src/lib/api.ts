import axios from "axios";
import { store } from "@/store/configureStore";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

// REQUEST INTERCEPTOR: Add Bearer token from store
api.interceptors.request.use((config) => {
  const state = store.getState();
  const accessToken = state.authStore?.accessToken;
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Single-flight refresh token helper (avoid multiple concurrent refresh calls)
let refreshCall: Promise<string> | null = null;

/**
 * Returns a promise that resolves with a new access token.
 * Ensures only one refresh request is in-flight at any time.
 */
const getRefreshedAccessToken = (refreshToken: string) => {
  if (!refreshCall) {
    refreshCall = axios
      .post(
        `${BASE_URL}/auth/refresh-token/`,
        { refresh: refreshToken },
        { headers: { "Content-Type": "application/json" } },
      )
      .then((res) => {
        // Expecting the refresh endpoint to return { access: "<token>" }
        const { access: newAccessToken } = res.data.data || {};
        // Update store tokens (using plain action payload to avoid circular imports)
        const state = store.getState();
        store.dispatch({
          type: "auth/login",
          payload: {
            user: state.authStore.user,
            accessToken: newAccessToken,
            refreshToken,
          },
        });
        return newAccessToken;
      })
      .catch((err) => {
        // On refresh failure, force a logout (clear entire auth state)
        store.dispatch({ type: "auth/logout" });
        // Propagate the error to callers
        throw err;
      });
  }
  return refreshCall;
};

// RESPONSE INTERCEPTOR: Handle 401, refresh token, retry original request
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error?.config;
    const state = store.getState();
    const refreshToken = state.authStore?.refreshToken;

    // Only attempt refresh on 401 and when refresh token exists and this request hasn't been retried
    if (
      error.response &&
      error.response.status === 401 &&
      refreshToken &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Use single-flight refresh helper
        const newAccessToken = await getRefreshedAccessToken(refreshToken);
        // Clear the shared refreshCall so future 401s can trigger a new refresh when needed
        refreshCall = null;

        // Attach the new token and retry the original request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // refresh failed and logout has been dispatched in helper
        refreshCall = null;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
