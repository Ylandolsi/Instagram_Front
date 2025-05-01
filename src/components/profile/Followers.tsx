import { userApi } from "@/api/user";
import useOutsideClick from "@/hooks/useOutsideClick";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Loader } from "../common/Loader";
import { FollowUnfollow } from "../common/FollowUnfollow";
import { useAuth } from "@/contexts/authContext";
import blankpdp from "@/assets/blankpdp.png";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export function Followers({
  open,
  setIsOpen,
  idUser,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  idUser: string;
}) {
  const { user: currentUser } = useAuth();
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const fetchFollowers = async (resetList = false) => {
    setLoading(true);
    try {
      const response = await userApi.getFollowers(
        idUser,
        resetList ? 1 : page,
        pageSize
      );
      if (resetList) {
        setPage(2);
        setFollowers(response.data.data.items);
      } else {
        setFollowers((prev) => [...prev, ...response.data.data.items]);
        setPage((prev) => prev + 1);
      }
      setHasNextPage(response.data.data.hasNextPage);
    } catch (error) {
      console.error("Error fetching followers:", error);
    } finally {
      setLoading(false);
    }
  };
  const loadMoreFollowers = async () => {
    if (loading || !hasNextPage) return;
    await fetchFollowers(false);
  };
  useEffect(() => {
    if (open) {
      setFollowers([]);
      fetchFollowers(true);
    }
  }, [open, idUser]);
  const outsideRef = useRef<any | null>(null);
  useOutsideClick(outsideRef, () => {
    close();
  });

  const close = () => {
    window.location.reload();
    setIsOpen(false);
  };

  return (
    open && (
      <div className="fixed inset-0 flex justify-center items-center backdrop-blur z-20 ">
        <div
          ref={outsideRef}
          className=" overflow-auto max-h-[600px] w-[90%] max-w-[420px] flex flex-col bg-[#333333] pt-3 rounded-lg">
          <div className="flex justify-between items-start border-b ">
            <div className="w-[48px] h-[43px] "></div>
            <div className="font-bold text-xl">Followers</div>
            <div
              className="w-[48px] h-[43px] flex justify-center cursor-pointer"
              onClick={close}>
              <X />
            </div>
          </div>
          {!loading && followers.length === 0 && (
            <div className="p-4 text-center text-gray-400">No Followers</div>
          )}
          {followers.length > 0 &&
            followers.map((follower) => (
              <div
                key={follower.id}
                className="flex justify-between p-3 items-center">
                <Link to={`/profile/${follower.id}`}>
                  <div className="flex gap-4 items-center ">
                    <div>
                      <img
                        src={follower.profilePictureUrl || blankpdp}
                        className="rounded-full"
                        style={{ width: 40 }}
                        alt={follower.userName}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://via.placeholder.com/40";
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="font-bold text-lg">
                        {follower.userName}
                      </div>
                      <div className="font-medium text-gray-400/90 text-sm">
                        {follower.firstName} {follower.lastName}
                      </div>
                    </div>
                  </div>
                </Link>
                {currentUser?.id !== follower.id && (
                  <FollowUnfollow
                    id={follower.id}
                    isFollowedByCurrentUser={follower.isFollowedByCurrentUser}
                  />
                )}
              </div>
            ))}
          {loading ? (
            <Loader />
          ) : (
            hasNextPage && (
              <div className="flex justify-center items-center p-3">
                <Button
                  className="bg-gray-200 p-2 shadow-none"
                  onClick={loadMoreFollowers}>
                  Load more
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    )
  );
}
