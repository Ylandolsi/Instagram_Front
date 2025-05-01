import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { MobileNavigation } from "./MobileNavigation";
import { SideBar } from "./SideBar";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useState } from "react";

const AppLayout = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1291px)");

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="flex justify-center gap-2">
        <Navbar />
        <main className="mt-13 grow ">
          <Outlet />
        </main>

        <div className="fixed bottom-0 left-0 right-0  py-2 border border-t-2 z-50 bg-background">
          <MobileNavigation
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <div className={isDesktop ? `w-[260px]` : `w-[72px]`}>
        <SideBar
          withNames={isDesktop}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
        />
      </div>
      <main
        className={`grow flex justify-center ${
          isDesktop ? `ml-[260px]` : `ml-[72px]`
        }`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
