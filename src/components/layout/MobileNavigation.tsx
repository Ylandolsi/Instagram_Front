import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export function MobileNavigation() {
  return (
    <div className="flex justify-around w-full ">
      <Link to={"/"}>
        <Home width={40} height={40} style={{ color: "#fff" }} />
      </Link>
    </div>
  );
}
