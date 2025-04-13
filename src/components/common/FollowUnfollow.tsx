import { Button } from "../ui/button";

export function FollowUnfollow({
  isFollowedByCurrentUser,
}: {
  isFollowedByCurrentUser: boolean;
}) {
  return isFollowedByCurrentUser ? (
    <Button className="bg-gray-400 shadow-none">Following</Button>
  ) : (
    <Button className="bg-blue-400 shadow-none">Follow</Button>
  );
}
