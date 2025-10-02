import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

const SECRET_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

export function setEncryptedCookie(name: string, value: any, days = 1) {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), SECRET_KEY).toString();
  Cookies.set(name, encrypted, { expires: days });
}

export function getDecryptedCookie(name: string) {
  const encrypted = Cookies.get(name);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Error al desencriptar cookie", err);
    return null;
  }
}

export function removeCookie(name: string) {
  Cookies.remove(name);
}