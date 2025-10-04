// src/services/authService.ts
import { tokenStorage } from '../utils/token';
import api from './api'; // Asegúrate de que este cliente Axios esté configurado correctamente
import { API_URL_ALL } from './urls';

// Tipos de respuesta
interface LoginResponse {
  token: string;
  refresh: string;
  user: any; // Puedes tipar mejor si tienes una interfaz de User
}

interface ResetPasswordEmailRequest {
  email: string;
}

interface ResetPasswordEmailResponse {
  mensaje: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
  confirm_password: string;
}

interface ResetPasswordResponse {
  mensaje: string;
}

export const authService = {
  login: async (username: string, password: string, rememberMe: boolean): Promise<any> => {
    const { data } = await api.post<LoginResponse>(API_URL_ALL.AUTH, { username, password });
    tokenStorage.setAccessToken(data.token);

    if (rememberMe) {
      tokenStorage.setRefreshToken(data.refresh);
    }

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

  requestPasswordReset: async (email: string): Promise<ResetPasswordEmailResponse> => {
    const { data } = await api.post<ResetPasswordEmailResponse>(
      '/api/accounts/api-rest-password-email/',
      { email } as ResetPasswordEmailRequest
    );
    return data;
  },

  resetPassword: async (
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<ResetPasswordResponse> => {
    if (password !== confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    const { data } = await api.put<ResetPasswordResponse>(
      '/api/accounts/api-rest-password/',
      {
        token,
        password,
        confirm_password: confirmPassword,
      } as ResetPasswordRequest
    );
    return data;
  },
};