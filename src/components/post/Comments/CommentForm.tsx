import { Input } from "@/components/ui/input";
import { Send as SendIcon } from "lucide-react";
import blankpdp from "@/assets/blankpdp.png";
import { cn } from "@/lib/utils";

export function CommentForm({
  profilePicture,
  contentComment,
  setcontentComment,
  handleSend,
  className,
  placeholder = "Add a new comment...",
}: {
  profilePicture: string | undefined;
  contentComment: string;
  setcontentComment: (value: string) => void;
  handleSend: () => Promise<void>;
  className?: string;
  placeholder?: string;
}) {
  return (
    <div className={cn("relative flex rounded-lg", className)}>
      <Input
        className="px-10 overflow-hidden grow"
        placeholder={placeholder}
        style={{ backgroundColor: "#1e1e1f", overflowWrap: "break-word" }}
        value={contentComment}
        onChange={(e) => setcontentComment(e.target.value)}
      />
      <div className="absolute bottom-[13%] left-2">
        <img
          className="rounded-full"
          src={profilePicture || blankpdp}
          style={{ width: "25px" }}
          alt="Profile"
        />
      </div>
      <div
        className="absolute bottom-[13%] right-2 cursor-pointer"
        onClick={handleSend}>
        <SendIcon />
      </div>
    </div>
  );
}
