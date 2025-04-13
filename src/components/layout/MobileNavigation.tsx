import { useAuth } from "@/contexts/authContext";
import { Home, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function MobileNavigation() {
  const { user } = useAuth();
  return (
    <div className="flex justify-around w-full items-center    ">
      <Link to={"/"}>
        <Home size={30} style={{ color: "#fff" }} />
      </Link>
      <Link to="/">
        <div className="flex items-center gap-6">
          <Plus size={30} />
        </div>
      </Link>
      <Link to={`/profile/${user?.id}`}>
        <div className="flex items-center gap-6">
          <div className="w-[30px] h-[30px]">
            <img src={user?.profilePictureUrl} className="rounded-full"></img>
          </div>
        </div>
      </Link>
    </div>
  );
}
