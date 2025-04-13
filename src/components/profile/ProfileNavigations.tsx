import { Grid2x2, BookMarked } from "lucide-react";

export function ProfileNavigation() {
  return (
    <div className="flex justify-evenly items-center py-3 border-b divide">
      <Grid2x2 className="text-blue-400" />
      <BookMarked />
    </div>
  );
}
