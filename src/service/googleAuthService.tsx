import api from "./api";
import { API_URL_ALL } from "./urls";
import { tokenStorage } from "../utils/token";

export const googleAuthService = {
    loginWithGoogleAccessToken: async (accessToken: string) => {
        const { data } = await api.post(
            API_URL_ALL.GOOGLE,
            { id_token: accessToken },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        tokenStorage.setAccessToken(data.access);

        return data.user;
    },
};