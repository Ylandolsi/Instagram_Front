import { apiResponse } from "@/types/apiResponse.type";
import api, { API_URL } from "./axios";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "@/types/auth.types";

export const authApi = {
  login: (credentials: LoginCredentials) => {
    return api.post<AuthResponse>("/Account/login", credentials);
  },

  logout: () => {
    return api.post<AuthResponse>("/Account/logout");
  },

  register: (userData: RegisterData) => {
    return api.post<AuthResponse>("/Account/register", userData);
  },

  refresh: () => {
    return api.post<AuthResponse>("/Account/refresh");
  },

  verifyEmailExists: (email: string) => {
    return api.post<AuthResponse>("/Account/verify/email", { email });
  },
  verifyUsernameExists: (username: string) => {
    return api.post<AuthResponse>("/Account/verify/username", { username });
  },

  getCurrentUser: async () => {
    return api.get<apiResponse<User>>("/Account/me");
  },

  loginGoogle: (returnurl: string) => {
    const googleLoginUrl = `${API_URL}/Account/login/google?returnUrl=${encodeURIComponent(
      returnurl
    )}`;
    return googleLoginUrl;
  },
};
