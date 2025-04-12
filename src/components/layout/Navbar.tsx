import { Input } from "@/components/ui/input";
import { Heart, Search } from "lucide-react";

export function Navbar() {
  return (
    <div className="fixed h-12  py-2 pb-12  top-0 left-0 right-0 w-full z-11 bg-background border border-b-2 border-t-0   ">
      <div className="flex justify-between items-center  px-4 ">
        <div className="font-display text-2xl">Instagram</div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              className="rounded pl-8 w-50 md:w-100 overflow-auto"
              placeholder="Search"
            />
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          <Heart />
        </div>
      </div>
    </div>
  );
}
