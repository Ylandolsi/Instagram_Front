import { User } from "@/types/auth.types";

interface ProfileStatsProps {
  userData: User;
}

export function ProfileStats({ userData }: ProfileStatsProps) {
  return (
    <div className="flex font-bold justify-between items-center py-3 px-10 border-b divide">
      <div className="text-center">
        {userData.postsCount} <div className="text-gray-300/50">Posts</div>
      </div>
      <div className="text-center">
        {userData?.followersCount}{" "}
        <div className="text-gray-300/50">Followers</div>
      </div>
      <div className="text-center">
        {userData?.followingCount}{" "}
        <div className="text-gray-300/50">Following</div>
      </div>
    </div>
  );
}
