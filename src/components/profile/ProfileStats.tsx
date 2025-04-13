import { User } from "@/types/auth.types";

interface ProfileStatsProps {
  userData: User;
  apply?: number;
}

export function ProfileStats({ userData, apply = 0 }: ProfileStatsProps) {
  if (apply === 0) return null;

  return apply == 1 ? (
    <div className="md:hidden flex font-bold justify-around items-center py-3 px-10 border-b divide">
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
  ) : (
    <div className="hidden md:flex gap-10 pl-2">
      <div className="text-center">
        {userData?.postsCount} <span className="text-gray-300/50">Posts</span>
      </div>
      <div className="text-center">
        {userData?.followersCount}{" "}
        <span className="text-gray-300/50">Followers</span>
      </div>
      <div className="text-center">
        {userData?.followingCount}{" "}
        <span className="text-gray-300/50">Following</span>
      </div>
    </div>
  );
}
