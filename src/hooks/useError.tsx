import { ErrorAxios } from "@/api/axios";
import { useState } from "react";

export function useError() {
  const [error, setError] = useState<ErrorAxios | null>(null);
  const clearError = () => setError(null);

  return { setError, error, clearError };
}
