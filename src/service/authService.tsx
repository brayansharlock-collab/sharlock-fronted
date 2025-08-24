import api from "./api";
import { tokenStorage } from "../utils/token";

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    tokenStorage.setAccessToken(data.accessToken);
    tokenStorage.setRefreshToken(data.refreshToken);
    return data.user;
  },

  logout: () => {
    tokenStorage.removeAccessToken();
    tokenStorage.removeRefreshToken();
  },

  getCurrentUser: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};
