import api from "./api";
import { API_URL_ALL } from "./urls";

export interface DocumentType {
  id: number;
  is_active: boolean;
  type: string;
  order: number;
}

export interface Gender {
  id: number;
  is_active: boolean;
  type: string;
  order: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  document_type: DocumentType | null;
  document: string;
  birth_date: string | null;
  age: string | number | null;
  gender: Gender | null;
  avatar: string | null;
  is_active: boolean;
}

export const userService = {
  // Traer TODOS los usuarios
  getUsers: async (params?: Record<string, any>) => {
    const { data } = await api.get(API_URL_ALL.USERS, { params });
    return data;
  },

  // Traer UN usuario por ID
  getUser: async (id: number) => {
    const { data } = await api.get(`${API_URL_ALL.USERS}${id}/`);
    return data as User;
  },

  // Actualizar usuario (PUT completo)
  updateUser: async (id: number, payload: Partial<User>) => {
    const { data } = await api.put(`${API_URL_ALL.USERS}${id}/`, payload);
    return data as User;
  },

  // (Opcional) Actualización parcial si tu API soporta PATCH
  patchUser: async (id: number, payload: Partial<User>) => {
    const { data } = await api.patch(`${API_URL_ALL.USERS}${id}/`, payload);
    return data as User;
  },

  // Eliminar usuario por ID
  deleteUser: async (id: number) => {
    await api.delete(`${API_URL_ALL.USERS}${id}/`);
    return true;
  },

  // (Helper) Obtener “mi usuario” desde el localStorage y traerlo del API
  getMeFromLocalStorage: async () => {
    const raw = localStorage.getItem("user");
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed?.id) throw new Error("No hay usuario en localStorage");
    const { data } = await api.get(`${API_URL_ALL.USERS}${parsed.id}/`);
    return data as User;
  },
};
