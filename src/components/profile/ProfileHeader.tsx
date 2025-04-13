import { User } from "@/types/auth.types";
import { useAuth } from "@/contexts/authContext";
import { Button } from "../ui/button";
import { FollowUnfollow } from "../common/FollowUnfollow";
import blankpdp from "@/assets/blankpdp.png";

interface ProfileHeaderProps {
  userData: User;
}

export function ProfileHeader({ userData }: ProfileHeaderProps) {
  const { user } = useAuth();
  const isCurrentUser = user?.id === userData?.id;

  return (
    <div className="flex flex-col gap-3 py-5 pl-4 border-b">
      <div className="flex justify-start items-center">
        <div>
          <img
            src={userData?.profilePictureUrl || blankpdp}
            className="w-[70px] h-[70px] rounded-full border-2 border-gray-200"
            alt="Profile"
          />
        </div>
        <div className="flex grow gap-10 pl-5 items-center">
          <div className="text-xl font-semibold text-white pl-2">
            {userData?.userName || "Username"}
          </div>

          {!isCurrentUser ? (
            <FollowUnfollow
              isFollowedByCurrentUser={
                userData?.isFollowedByCurrentUser || false
              }
            />
          ) : (
            <Button className="bg-[#4a4a4a] text-white hover:bg-[#303030]">
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-10">
        <p className="text-white font-semibold">
          {userData?.firstName} {userData?.lastName}
        </p>
      </div>
      <p className="text-gray-400 text-sm">
        {userData?.bio || "No bio available"}
      </p>
    </div>
  );
}
