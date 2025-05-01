import { User } from "@/types/auth.types";
import { useAuth } from "@/contexts/authContext";
import { Button } from "../ui/button";
import { FollowUnfollow } from "../common/FollowUnfollow";
import blankpdp from "@/assets/blankpdp.png";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ProfileStats } from "./ProfileStats";
import { ToastContainer } from "react-toastify";

interface ProfileHeaderProps {
  userData: User;
}

export function ProfileHeader({ userData }: ProfileHeaderProps) {
  const { user } = useAuth();
  const isCurrentUser = user?.id === userData?.id;

  const isTablet = useMediaQuery("(max-width: 768px)");
  console.log("userData", userData);

  return (
    <div className="flex flex-col gap-3 py-5 pl-5 md:pl-10 border-b md:text-xl ">
      <div className="flex justify-start items-center gap-6 ">
        <div>
          <img
            src={userData?.profilePictureUrl || blankpdp}
            className="size-[70px] md:size-[150px] rounded-full border-2 border-gray-200"
            alt="Profile"
          />
        </div>
        <div className="flex flex-col gap-5  ">
          <div className="flex grow gap-3  items-center flex-wrap ">
            <div className="text-xl font-semibold text-white pl-2">
              {userData?.userName || "Username"}
            </div>

            {!isCurrentUser ? (
              <FollowUnfollow
                id={userData?.id}
                isFollowedByCurrentUser={
                  userData?.isFollowedByCurrentUser || false
                }
                onclick={() => {
                  window.location.reload();
                }}
              />
            ) : null}
          </div>
          <ProfileStats apply={2} userData={userData} />
        </div>
      </div>
      <div className="pl-2">
        <p className="text-white font-semibold ">
          {userData?.firstName} {userData?.lastName}
        </p>
        <p className="text-gray-400 text-sm">
          {userData?.bio || "No bio available"}
        </p>
      </div>
    </div>
  );
}
