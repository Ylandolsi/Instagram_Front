import api from "./axios";
import { apiResponse } from "@/types/apiResponse.type";
import { User } from "@/types/auth.types";

export const userApi = {
  getUserData: async (userId: string) => {
    return await api.get<apiResponse<User>>(`Users/${userId}`);
  },
};
