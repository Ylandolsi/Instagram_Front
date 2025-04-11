import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import { useAuth } from "../../contexts/authContext";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

export function Error() {
  const { error, clearError } = useAuth();

  if (!error) return null;
  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        onClose: () => clearError(),
      });
    }
  }, [error, clearError]);

  if (!error) return null;
  return (
    <>
      <Alert variant="destructive" className="my-4">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
        <button
          onClick={clearError}
          className="absolute top-2 right-2 text-destructive hover:text-blue-300/80">
          &times; {/* x */}
        </button>
      </Alert>
      <div>
        <ToastContainer />
      </div>
    </>
  );
}
