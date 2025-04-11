// import { useCallback } from "react";
// import { AuthResponse, RegisterData } from "@/types/auth.types";
// import { useApiRequest } from "@/api/apiRequest";
// import { authApi } from "@/api/authApi";

// export function useAuthService() {
//   const registerApi = useApiRequest<AuthResponse, RegisterData>();

//   const RegisterUser = useCallback(
//     async (registerData: RegisterData) => {
//       try {
//         return await registerApi.execute(authApi.register, registerData);
//       } catch (error) {
//         throw error;
//       }
//     },
//     [registerApi]
//   );

//   return {
//     RegisterUser,
//     registerApi,
//   };
// }
