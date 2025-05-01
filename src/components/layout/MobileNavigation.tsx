import { useAuth } from "@/contexts/authContext";
import { Home, Plus, Search as SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { HeartFilledOrNotFilled } from "../post/PostActions";
import { useNotifications } from "@/contexts/notificationContext";
import { Search } from "../search/search";
import { useEffect, useRef } from "react";

export function MobileNavigation({
  isSearchOpen,
  setIsSearchOpen,
}: {
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}) {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSearchOpen(!isSearchOpen);
  };

  const refSearch = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex justify-around w-full items-center  ">
      <Link to="/upload">
        <div className="flex items-center gap-6">
          <Plus size={30} />
        </div>
      </Link>
      <div
        ref={refSearch}
        className="flex items-center gap-6 cursor-pointer"
        onClick={handleSearchClick}>
        <SearchIcon size={30} />
      </div>
      <Link to={"/"}>
        <Home size={30} style={{ color: "#fff" }} />
      </Link>

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
        </div>
      </Link>

      <Link to={`/profile/${user?.id}`}>
        <div className="flex items-center gap-6">
          <div className="w-[30px] h-[30px]">
            <img src={user?.profilePictureUrl} className="rounded-full"></img>
          </div>
        </div>
      </Link>
      {isSearchOpen && (
        <div className="fixed h-full w-full  inset-0 z-50   ">
          <Search isMobile={true} isVisible={isSearchOpen} />
        </div>
      )}
    </div>
  );
}
