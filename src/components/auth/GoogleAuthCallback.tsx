import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";

export function GoogleAuthCallback() {
  const { checkAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function handleGoogleCallback() {
      try {
        await checkAuth();
        localStorage.setItem("Auth", "true");
        navigate("/");
      } catch (err) {
        console.error("Google authentication failed:", err);
        setError("Authentication failed. Please try again.");
      }
    }

    handleGoogleCallback();
  }, [checkAuth, navigate]);

  if (!error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="loader"></div>
          <p className="mt-4">Completing login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded">
          Return to Login
        </button>
      </div>
    </div>
  );
}
