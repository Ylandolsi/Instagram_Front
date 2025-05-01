import { useAuth } from "@/contexts/authContext";
import {
  Ellipsis,
  Home,
  Instagram,
  Plus,
  Search as SearchIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useNotifications } from "@/contexts/notificationContext";
import { HeartFilledOrNotFilled } from "../post/PostActions";
import { Search } from "../search/search";

export function SideBar({
  withNames,
  isSearchOpen,
  setIsSearchOpen,
}: {
  withNames: boolean;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { unreadCount } = useNotifications();

  const wid = !withNames || isSearchOpen ? "[72px]" : "[260px]";
  const refSearch = useRef<HTMLDivElement>(null);
  const showNames = withNames && !isSearchOpen;
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (refSearch.current && refSearch.current.contains(target)) {
        return;
      }

      let element = target;
      while (element && element !== document.body) {
        if (element.classList.contains("bg-[#212121]")) {
          return; // search page bg
        }
        element = element.parentElement as HTMLElement;
      }

      setIsSearchOpen(false);
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isSearchOpen, setIsSearchOpen]);

  console.log("unreadCount", unreadCount);
  return (
    <div
      className={`fixed  h-screen w-${wid} border-r border-amber-50/10 transition-all duration-300 ease-in-out z-100`}>
      <div
        className={`relative flex flex-col ${
          showNames ? "flex-start pl-10" : "items-center"
        } gap-8 pt-10 h-full  z-50 `}>
        <Link to="/" className="mb-10">
          <div className="flex items-center gap-6">
            <Instagram size={30} />
            {showNames && (
              <div className="text-3xl font-display transition-opacity duration-300 ease-in-out">
                Instagram
              </div>
            )}
          </div>
        </Link>

        <Link to="/">
          <div className="flex items-center gap-6">
            <Home size={30} />
            {showNames && (
              <div className="text-lg font-semibold transition-opacity duration-300 ease-in-out">
                Home
              </div>
            )}
          </div>
        </Link>
        <div
          ref={refSearch}
          className="flex items-center gap-6 cursor-pointer"
          onClick={handleSearchClick}>
          <SearchIcon size={30} />
          {showNames && (
            <div className="text-lg font-semibold transition-opacity duration-300 ease-in-out">
              Search
            </div>
          )}
        </div>
        <Link to="/notification">
          <div className="flex items-center gap-6">
            <div className="relative">
              <HeartFilledOrNotFilled
                className=""
                onClick={() => ""}
                liked={unreadCount > 0}
              />
              {unreadCount > 0 && (
                <div className="absolute flex items-center justify-center bottom-3 left-4 z-40 p-3 w-4 h-4 rounded-full bg-red-500 text-xs font-bold">
                  {unreadCount}
                </div>
              )}
            </div>

            {showNames && (
              <div className="text-lg font-semibold transition-opacity duration-300 ease-in-out">
                Notifications
              </div>
            )}
          </div>
        </Link>
        <Link to="/upload">
          <div className="flex items-center gap-6">
            <Plus size={30} />
            {showNames && (
              <div className="text-lg font-semibold transition-opacity duration-300 ease-in-out">
                Add new post{" "}
              </div>
            )}
          </div>
        </Link>
        <Link to={`/profile/${user?.id}`}>
          <div className="flex items-center gap-6">
            <div className="w-[30px] h-[30px]">
              <img src={user?.profilePictureUrl} className="rounded-full"></img>
            </div>
            {showNames && (
              <div className="text-lg font-semibold transition-opacity duration-300 ease-in-out">
                Profile
              </div>
            )}
          </div>
        </Link>

        <div className="relative mt-auto mb-10">
          <div className="flex items-center gap-6" onClick={handleClick}>
            <Ellipsis size={16} className="" />
            {showNames && (
              <div className="text-lg font-semibold transition-opacity duration-300 ease-in-out">
                More
              </div>
            )}
          </div>
          {isOpen && (
            <div
              className="absolute bottom-9 p-3 h-12 w-[200px] rounded-lg flex justify-center items-center text-sm font-semibold bg-[#212121] hover:bg-[#3d3d3d]"
              onClick={() => {
                setIsOpen(false);

                logout();
                window.location.href = "/login";
              }}>
              Log out
            </div>
          )}
        </div>
        <Search isVisible={isSearchOpen} />
      </div>
    </div>
  );
}
