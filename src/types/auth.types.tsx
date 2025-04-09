import { apiResponse } from "./apiResponse.type";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  profilePictureUrl?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  //   postsCount: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse extends apiResponse<boolean> {}
