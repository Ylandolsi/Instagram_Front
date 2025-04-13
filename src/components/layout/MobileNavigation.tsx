import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export function MobileNavigation() {
  return (
    <div className="flex justify-around w-full items-center    ">
      <Link to={"/"}>
        <Home size={30} style={{ color: "#fff" }} />
      </Link>
    </div>
  );
}
