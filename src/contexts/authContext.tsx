import { authApi } from "@/api/authApi";
import { ErrorAxios, handleError } from "@/api/axios";
import { useError } from "@/hooks/useError";
import { LoginCredentials, RegisterData, User } from "@/types/auth.types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { toast, ToastContainer } from "react-toastify";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  loginGoogle: () => void;
  checkAuth: () => Promise<void>;
  setError: (error: ErrorAxios) => void;
  error: ErrorAxios | null;
  clearError: () => void;
  setAuthenticationStatus: (isAuthenticated: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setError, error, clearError } = useError();

  const setAuthenticationStatus = (isAuthenticated: boolean) => {
    localStorage.setItem("Auth", isAuthenticated ? "true" : "false");
    setIsAuthenticated(isAuthenticated);
  };

  const checkAuth = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData.data.data);
      setAuthenticationStatus(true);
    } catch (error) {
      setUser(null);
      setAuthenticationStatus(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("Auth") === "true";
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    clearError();
    try {
      await authApi.login(credentials);
      const userData = await authApi.getCurrentUser();
      setUser(userData.data.data);
      setAuthenticationStatus(true);
      console.log(userData.data.data);
    } catch (error) {
      const authError = handleError(error);
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setAuthenticationStatus(false);
    } catch (error) {
      console.error("Logout failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    clearError();

    try {
      await authApi.register(userData);
      await login({ email: userData.email, password: userData.password });
    } catch (error) {
      const authError = handleError(error);
      setError(authError);
      console.error("Registration failed", authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = () => {
    const frontendCallbackUrl = `${window.location.origin}/google/callback`;
    const googleLoginUrl = authApi.loginGoogle(frontendCallbackUrl);
    window.location.href = googleLoginUrl;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    loginGoogle,
    checkAuth,
    setError,
    error,
    clearError,
    setAuthenticationStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
