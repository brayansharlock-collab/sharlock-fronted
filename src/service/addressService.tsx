import api from "./api";
import { API_URL_ALL } from "./urls";

export interface Department {
  id: number;
  name: string;
  code: string;
  city: City[];
}

export interface City {
  id: number;
  name: string;
  code: string;
}

export interface AddressType {
  id: number;
  name: string;
  order: number;
}

export interface Address {
  id: number;
  department?: Department;
  city?: City;
  type_of_address?: AddressType;
  address: string;
  telephone_number?: string;
  barrio?: string;
  apartment?: string | null;
  indications?: string;
  postal_code?: string;
  is_principal?: boolean;
  user?: number;
}

export const addressService = {
  getAll: async () => {
    const { data } = await api.get(API_URL_ALL.ADRESS);
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get(`${API_URL_ALL.ADRESS}${id}/`);
    return data;
  },
  create: async (payload: any) => {
    const { data } = await api.post(API_URL_ALL.ADRESS, payload);
    return data;
  },
  update: async (id: number, payload: any) => {
    const { data } = await api.put(`${API_URL_ALL.ADRESS}${id}/`, payload);
    return data;
  },
  patch: async (id: number, payload: Partial<Address>) => {
    const { data } = await api.put(`${API_URL_ALL.ADRESS}${id}/`, payload);
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`${API_URL_ALL.ADRESS}${id}/`);
    return data;
  },


  getDepartments: async (): Promise<Department[]> => {
    const { data } = await api.get(API_URL_ALL.DEPARMENT);
    console.log(data.data.results);
    
    return data.data.results;
  },
  getAddressTypes: async (): Promise<AddressType[]> => {
    const { data } = await api.get(API_URL_ALL.APARMENT_TYPE);
    return data;
  },
};
