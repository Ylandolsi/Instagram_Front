import { User } from "@/types/auth.types";
import { useState } from "react";
import { Followers } from "./Followers";
import { Followings } from "./Following";

interface ProfileStatsProps {
  userData: User;
  apply?: number;
}

export function ProfileStats({ userData, apply = 0 }: ProfileStatsProps) {
  if (apply === 0) return null;
  const [openFollowers, setIsOpenFollowers] = useState(false);
  const [openFollowing, setIsOpenFollowing] = useState(false);

  return (
    <>
      <Followers
        open={openFollowers}
        setIsOpen={setIsOpenFollowers}
        idUser={userData.id}
      />
      <Followings
        open={openFollowing}
        setIsOpen={setIsOpenFollowing}
        idUser={userData.id}
      />

      {apply == 1 ? (
        <div className="md:hidden flex font-bold justify-around items-center py-3 px-10 border-b divide">
          <div className="text-center">
            {userData.postsCount} <div className="text-gray-300/50">Posts</div>
          </div>
          <div className="text-center">
            {userData?.followersCount}{" "}
            <div
              className="text-gray-300/50"
              onClick={() => {
                setIsOpenFollowers(true);
              }}>
              Followers
            </div>
          </div>
          <div className="text-center">
            {userData?.followingCount}{" "}
            <div
              className="text-gray-300/50"
              onClick={() => {
                setIsOpenFollowing(true);
              }}>
              Following
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex gap-10 pl-2">
          <div className="text-center">
            {userData?.postsCount}{" "}
            <span className="text-gray-300/50">Posts</span>
          </div>
          <div className="text-center">
            {userData?.followersCount}{" "}
            <span
              className="text-gray-300/50"
              onClick={() => {
                setIsOpenFollowers(true);
              }}>
              Followers
            </span>
          </div>
          <div
            className="text-center"
            onClick={() => {
              setIsOpenFollowing(true);
            }}>
            {userData?.followingCount}{" "}
            <span className="text-gray-300/50">Following</span>
          </div>
        </div>
      )}
    </>
  );
}
