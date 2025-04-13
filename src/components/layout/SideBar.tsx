import { useAuth } from "@/contexts/authContext";
import { Ellipsis, Heart, Home, Instagram, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function SideBar({ withNames }: { withNames?: boolean }) {
  const wid = withNames ? "w-[260px]" : "w-[72px]";
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed  flex flex-col ${
        withNames ? "flex-start pl-10" : "items-center"
      }  gap-8 h-screen pt-10 ${wid} border-r border-amber-50/10`}>
      <Link to="/" className="mb-10">
        <div className=" flex items-center gap-6">
          <Instagram size={30} />
          {withNames && <div className="text-3xl font-display">Instagram</div>}
        </div>
      </Link>

      <Link to="/">
        <div className="flex items-center gap-6">
          <Home size={30} />
          {withNames && <div className="text-lg font-semibold">Home</div>}
        </div>
      </Link>
      <Link to="/">
        <div className="flex items-center gap-6">
          <Search size={30} />
          {withNames && <div className="text-lg font-semibold">Search</div>}
        </div>
      </Link>
      <Link to="/">
        <div className="flex items-center gap-6">
          <Heart size={30} />
          {withNames && (
            <div className="text-lg font-semibold">Notifications</div>
          )}
        </div>
      </Link>
      <Link to="/">
        <div className="flex items-center gap-6">
          <Plus size={30} />
          {withNames && (
            <div className="text-lg font-semibold">Add new post </div>
          )}
        </div>
      </Link>
      <Link to={`/profile/${user?.id}`}>
        <div className="flex items-center gap-6">
          <div className="w-[30px] h-[30px]">
            <img src={user?.profilePictureUrl} className="rounded-full"></img>
          </div>
          {withNames && <div className="text-lg font-semibold">Profile</div>}
        </div>
      </Link>

      <div className="relative mt-auto mb-10">
        <div className="flex items-center gap-6" onClick={handleClick}>
          <Ellipsis size={16} className="" />
          {withNames && <div className="text-lg font-semibold">More</div>}
        </div>
        {isOpen && (
          <div className="absolute bottom-9 p-3 h-12 w-[200px] rounded-lg flex justify-center items-center text-sm font-semibold bg-[#212121] hover:bg-[#3d3d3d]">
            Log out
          </div>
        )}
      </div>
    </div>
  );
}
