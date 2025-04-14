import { useState } from "react";
import { Button } from "../ui/button";
import { userApi } from "@/api/user";
import { toast } from "react-toastify";

export function FollowUnfollow({
  id,
  isFollowedByCurrentUser,
}: {
  id: string;
  isFollowedByCurrentUser: boolean;
}) {
  const [isFollowed, setIsFollowed] = useState(isFollowedByCurrentUser);

  const handleToggle = async () => {
    try {
      if (isFollowed) {
        await userApi.UnfollowUser(id);
      } else {
        await userApi.FollowUser(id);
      }
      setIsFollowed(!isFollowed);
    } catch (error) {
      console.error("Error toggling follow status:", error);
      toast.error("Error toggling follow status");
    }
  };

  return isFollowed ? (
    <Button className="bg-gray-400 shadow-none" onClick={handleToggle}>
      Following
    </Button>
  ) : (
    <Button className="bg-blue-400 shadow-none" onClick={handleToggle}>
      Follow
    </Button>
  );
}
