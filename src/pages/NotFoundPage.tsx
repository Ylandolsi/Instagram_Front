import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-1 h-full">
      <div className="text-4xl font-bold">Page Not Found</div>
      <Link to="/" className="text-orange-200 underline mt-4">
        {" "}
        Back to home page
      </Link>
    </div>
  );
}
