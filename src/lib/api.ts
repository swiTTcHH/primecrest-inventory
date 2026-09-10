import { store } from "@/store/configureStore";
import { logout, setUser } from "@/store/slice/authSlice";
import axios from "axios";

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
 * Can be called with an explicit token or will read from Redux state.
 */
export const getRefreshedAccessToken = (token?: string): Promise<string> => {
	const state = store.getState();
	const refreshToken = token || state.authStore?.refreshToken;

	if (!refreshToken) {
		store.dispatch(logout());
		return Promise.reject(new Error("No refresh token available"));
	}

	if (!refreshCall) {
		refreshCall = axios
			.post(
				`${BASE_URL}/auth/refresh-token/`,
				{ refreshToken },
				{ headers: { "Content-Type": "application/json" } },
			)
			.then((res) => {
				const newAccessToken =
					res.data?.tokens?.accessToken ??
					res.data?.accessToken ??
					res.data?.data?.access;

				const newRefreshToken =
					res.data?.tokens?.refreshToken ??
					res.data?.refreshToken ??
					res.data?.data?.refresh ??
					refreshToken;

				if (!newAccessToken) {
					throw new Error(
						"Refresh endpoint did not return an access token",
					);
				}

				const currentState = store.getState();
				if (!currentState.authStore.user) {
					throw new Error(
						"Cannot refresh token without an authenticated user",
					);
				}

				store.dispatch(
					setUser({
						user: currentState.authStore.user,
						accessToken: newAccessToken,
						refreshToken: newRefreshToken,
						isAuthenticated: true,
					}),
				);
				return newAccessToken;
			})
			.catch((err) => {
				// Refresh token expired (e.g. 7 days) or invalid -> full logout
				store.dispatch(logout());
				throw err;
			})
			.finally(() => {
				refreshCall = null;
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

				// Attach the new token and retry the original request
				originalRequest.headers = originalRequest.headers || {};
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

export default api;
