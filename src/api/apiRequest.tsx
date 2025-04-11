// import axios, { AxiosError, AxiosResponse } from "axios";
// import { useCallback, useState } from "react";
// import { toast } from "react-hot-toast";

// export interface ApiError {
//   message: string;
//   code?: string;
//   field?: string;
// }

// export function useApiRequest<TResponse, TParams = void>() {
//   const [data, setData] = useState<TResponse | null>(null);
//   const [error, setError] = useState<ApiError | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleError = (error: any): ApiError => {
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError<any>;

//       if (axiosError.response) {
//         const status = axiosError.response.status;
//         const responseData = axiosError.response.data;

//         return {
//           message:
//             responseData.message || "An error occurred during authentication",
//           code: `HTTP_${status}`,
//         };
//       }

//       // Network errors
//       if (axiosError.request && !axiosError.response) {
//         return {
//           message: "Network error. Please check your connection and try again",
//           code: "NETWORK_ERROR",
//         };
//       }
//     }

//     //  fallback for non-axios errors
//     return {
//       message: error.message || "An unexpected error occurred",
//       code: "UNKNOWN_ERROR",
//     };
//   };

//   const execute = useCallback(
//     async (
//       apiFunction: (params: TParams) => Promise<AxiosResponse<TResponse>>,
//       params: TParams
//     ) => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await apiFunction(params);
//         setData(response.data);
//         return response.data;
//       } catch (err) {
//         const formattedError = handleError(err);
//         setError(formattedError);
//         toast.error(formattedError.message);
//         throw formattedError;
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   const reset = useCallback(() => {
//     setData(null);
//     setError(null);
//     setLoading(false);
//   }, []);

//   return { execute, data, error, loading, setData, reset };
// }
