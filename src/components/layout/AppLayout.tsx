import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { MobileNavigation } from "./MobileNavigation";

const AppLayout = () => {
  return (
    <div className="">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0  pt-3 border border-t-2 z-10 bg-background">
        <MobileNavigation />
      </div>
    </div>
  );
};

export default AppLayout;
