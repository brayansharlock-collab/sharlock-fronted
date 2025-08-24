import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenStorage = {
  getAccessToken: () => Cookies.get(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => Cookies.set(ACCESS_TOKEN_KEY, token, { secure: true, sameSite: "strict" }),
  removeAccessToken: () => Cookies.remove(ACCESS_TOKEN_KEY),

  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => Cookies.set(REFRESH_TOKEN_KEY, token, { secure: true, sameSite: "strict" }),
  removeRefreshToken: () => Cookies.remove(REFRESH_TOKEN_KEY),
};
