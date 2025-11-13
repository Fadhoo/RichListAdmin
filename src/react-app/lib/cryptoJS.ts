/* eslint-disable @typescript-eslint/no-explicit-any */
import { AES, enc } from "crypto-js";

const encryptionKey = import.meta.env.VITE_CRYPTO_JS_ENCRYPTION_KEY || "";

export const encrypt = (data: string) => {
  const encrypts = AES.encrypt(data, encryptionKey).toString();
  return encrypts;
};

export const decrypt = (data: string) => {
  const decrypts = AES.decrypt(data, encryptionKey).toString(enc.Utf8);
  return decrypts;
};

export const encryptData = (data: any) => {
  return encrypt(JSON.stringify(data));
};

export const decryptData = (data: any) => {
  return decrypt(JSON.parse(data));
};
