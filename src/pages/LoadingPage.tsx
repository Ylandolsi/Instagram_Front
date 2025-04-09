import { Loader } from "lucide-react";

export function LoadingPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin" size={16} />
    </div>
  );
}
