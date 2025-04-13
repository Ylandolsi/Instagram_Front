import { useAuth } from "@/contexts/authContext";
import { useParams } from "react-router-dom";
import { User } from "@/types/auth.types";
import { Loader } from "@/components/common/Loader";
import { useUserProfile } from "./hooks/useUserProfile";
import { useUserPosts } from "./hooks/useUserPosts";
import { ProfileStats } from "./ProfileStats";
import { ProfileNavigation } from "./ProfileNavigations";
import { PostsGrid } from "./PostsGrid";
import { ProfileHeader } from "./ProfileHeader";

export function Profile() {
  const { user } = useAuth();
  const { id } = useParams<string>();

  if (id === undefined) {
    throw new Error("User ID is undefined");
  }

  const {
    userData,
    loading: loadingUser,
    error: errorUser,
  } = useUserProfile(id);

  const {
    posts,
    loading: loadingPost,
    error: errorPost,
    loaderRef: loaderElementRef,
  } = useUserPosts(id);

  const isCurrentUser = user?.id === userData?.id;

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Loader />
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full  ">
      <ProfileHeader userData={userData as User} />
      <ProfileStats userData={userData as User} />
      <ProfileNavigation />
      <PostsGrid
        posts={posts}
        loading={loadingPost}
        loaderRef={loaderElementRef}
      />
    </div>
  );
}
