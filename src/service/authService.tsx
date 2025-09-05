import api from "./api";
import { API_URL_ALL } from "./urls";
import { tokenStorage } from "../utils/token";

export const authService = {
  login: async (username: string, password: string) => {
    const { data } = await api.post(API_URL_ALL.AUTH, { username, password });
    tokenStorage.setAccessToken(data.token);
    tokenStorage.setRefreshToken(data.refresh);
    return data.user;
  },

  logout: () => {
    tokenStorage.removeAccessToken();
    tokenStorage.removeRefreshToken();
  },

  getCurrentUser: async () => {
    const { data } = await api.get(API_URL_ALL.USERS);
    return data;
  },
};
