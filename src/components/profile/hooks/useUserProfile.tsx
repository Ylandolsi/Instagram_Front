import { useState, useEffect } from "react";
import { User } from "@/types/auth.types";
import { userApi } from "@/api/user";

export function useUserProfile(userId: string) {
  const [userData, setUserData] = useState<User>({} as User);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await userApi.getUserData(userId);
        setUserData(response.data.data);
      } catch (error) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  return { userData, loading, error };
}
