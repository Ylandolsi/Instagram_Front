import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { User } from "@/types/auth.types";
import { useAuth } from "@/contexts/authContext";
import { Loader } from "@/components/common/Loader";
import { likesApi } from "@/api/likes";
import useOutsideClick from "@/hooks/useOutsideClick";
import blankpdp from "@/assets/blankpdp.png";
import { FollowUnfollow } from "@/components/common/FollowUnfollow";
import { Link } from "react-router-dom";

interface LikesModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  likesCount: number;
}

export function LikesModal({
  postId,
  isOpen,
  onClose,
  likesCount,
}: LikesModalProps) {
  const pageSize = 20;
  const [page, setPage] = useState<number>(1);
  const { user: currentUser } = useAuth();
  const [usersLiked, setUsersLiked] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const outsideRef = useRef<any | null>(null);

  const fetchLikes = async (resetList = false) => {
    setLoading(true);
    try {
      const response = await likesApi.getUsersWhoLikedPost(
        postId,
        resetList ? 1 : page,
        pageSize
      );
      if (resetList) {
        setUsersLiked(response.data.data.items);
      } else {
        setUsersLiked([...usersLiked, ...response.data.data.items]);
        setPage(page + 1);
      }
      setHasNextPage(response.data.data.hasNextPage);
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreLikes = async () => {
    if (loading || !hasNextPage) return;
    await fetchLikes(false);
  };

  useEffect(() => {
    if (isOpen) {
      setUsersLiked([]);
      fetchLikes(true);
      setPage(2);
    }
  }, [isOpen, likesCount]);

  useOutsideClick(outsideRef, () => onClose());

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center backdrop-blur z-20 ">
        <div
          ref={outsideRef}
          className=" overflow-auto max-h-[600px] w-[90%] max-w-[420px] flex flex-col bg-[#333333] pt-3 rounded-lg">
          <div className="flex justify-between items-start border-b ">
            <div className="w-[48px] h-[43px] "></div>
            <div className="font-bold text-xl">Likes</div>
            <div
              className="w-[48px] h-[43px] flex justify-center cursor-pointer"
              onClick={onClose}>
              <X />
            </div>
          </div>
          {loading ? (
            <div className="p-8 flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {usersLiked.length > 0 ? (
                usersLiked.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between p-3 items-center">
                    <Link to={`/profile/${user.id}`}>
                      <div className="flex gap-4 items-center ">
                        <div>
                          <img
                            src={user.profilePictureUrl || blankpdp}
                            className="rounded-full"
                            style={{ width: 40 }}
                            alt={user.userName}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "https://via.placeholder.com/40";
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="font-bold text-lg">
                            {user.userName}
                          </div>
                          <div className="font-medium text-gray-400/90 text-sm">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </Link>
                    {currentUser?.id !== user.id && (
                      <FollowUnfollow
                        id={user.id}
                        isFollowedByCurrentUser={user.isFollowedByCurrentUser}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400">
                  No likes yet
                </div>
              )}
              {hasNextPage && (
                <div className="flex justify-center items-center p-3">
                  <Button
                    className="bg-gray-200 p-2 shadow-none"
                    onClick={loadMoreLikes}>
                    Load more
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  );
}
