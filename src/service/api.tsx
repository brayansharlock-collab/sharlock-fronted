import axios from "axios";
import { API_URL_ALL } from "./urls";
import { tokenStorage } from "../utils/token";

const api = axios.create({
  baseURL: API_URL_ALL.BASE_URL,
  // withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          const { data } = await api.post(API_URL_ALL.REFRESH, { token: refreshToken });
          tokenStorage.setAccessToken(data.accessToken);

          originalRequest.headers.Authorization = `JWT ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        tokenStorage.removeAccessToken();
        tokenStorage.removeRefreshToken();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
