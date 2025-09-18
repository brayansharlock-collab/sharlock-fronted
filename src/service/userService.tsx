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

  register: async (payload: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
    document_type_id: number;
    document: string;
    birth_date: string;
    gender_id: number;
  }) => {
    const { data } = await api.post(API_URL_ALL.USERS, payload);
    return data as User;
  },

  getUsers: async (params?: Record<string, any>) => {
    const { data } = await api.get(API_URL_ALL.USERS, { params });
    return data;
  },

  getUser: async (id: number) => {
    const { data } = await api.get(`${API_URL_ALL.USERS}${id}/`);
    return data as User;
  },

  updateUser: async (id: number, payload: Partial<User>) => {
    const { data } = await api.put(`${API_URL_ALL.USERS}${id}/`, payload);
    return data as User;
  },

  patchUser: async (id: number, payload: Partial<User>) => {
    const { data } = await api.patch(`${API_URL_ALL.USERS}${id}/`, payload);
    return data as User;
  },

  deleteUser: async (id: number) => {
    await api.delete(`${API_URL_ALL.USERS}${id}/`);
    return true;
  },

  getMeFromLocalStorage: async () => {
    const raw = localStorage.getItem("user");
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed?.id) throw new Error("No hay usuario en localStorage");
    const { data } = await api.get(`${API_URL_ALL.USERS}${parsed.id}/`);
    return data as User;
  },
};
