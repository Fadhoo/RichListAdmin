import type { User } from "./users";

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  // country: string;
  mobile: string;
  // dateOfBirth: Date;
  // shopName: string;
  // shopDescription: string;
  // shopLocation: string;
  // shopProducts: string;
  // date: Date;
}

export interface LoginBody {
  email: string;
  password: string;
}

export type LoginResponseData = {
  user: User;
  tokens: {
    access: TokenWithExpiry;
    refresh: TokenWithExpiry;
  };
};

export type TokenWithExpiry = {
  token: string;
  expires: Date;
};

export interface ForgotPasswordBody {
  email: string;
  otp?: string;
  new_password?: string;
  new_password_confirmation?: string;
}
