import { userApi } from "@/api/user";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Loader } from "../common/Loader";
import useDebounce from "@/hooks/useDebounce";
import { User } from "@/types/auth.types";
import { FollowUnfollow } from "../common/FollowUnfollow";

export function Search({
  isMobile = false,
  isVisible = true,
}: {
  isMobile?: boolean;
  isVisible?: boolean;
}) {
  if (!isVisible) return null;
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const [searchUser, setSearchUser] = useState<User[]>([]);
  const loaderElementRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false);

  const fetchSearchUser = useCallback(
    async (
      searchQuery: string,
      pageNum: number,
      pageSize: number,
      reload: boolean = false
    ) => {
      if (!searchQuery.trim() || loadingRef.current) {
        if (!searchQuery.trim()) setSearchUser([]);
        return;
      }

      loadingRef.current = true;
      setIsLoading(true);

      try {
        console.log(
          `Fetching search results for '${searchQuery}', page: ${pageNum}`
        );
        const response = await userApi.searchUsers(
          searchQuery,
          pageNum,
          pageSize
        );

        if (reload) {
          setSearchUser(response.data.data.items);
          setPage(2);
        } else {
          setSearchUser((prev) => [...prev, ...response.data.data.items]);
          setPage((prev) => prev + 1);
        }

        setHasNextPage(response.data.data.hasNextPage);
      } catch (error) {
        console.error("Error fetching search users:", error);
        if (reload) setSearchUser([]);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    },
    []
  );

  useEffect(() => {
    if (isVisible) {
      setPage(1);
      setHasNextPage(false);
      setIsLoading(false);
      loadingRef.current = false;
    }
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  useEffect(() => {
    if (debouncedQuery) {
      fetchSearchUser(debouncedQuery, 1, 10, true);
    } else {
      setSearchUser([]);
    }
  }, [debouncedQuery, fetchSearchUser]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        !loadingRef.current &&
        hasNextPage &&
        debouncedQuery
      ) {
        console.log("Search scroll threshold reached, loading more results");
        fetchSearchUser(debouncedQuery, page, 10, false);
      }
    }, options);

    observerRef.current = observer;

    if (loaderElementRef.current) {
      observer.observe(loaderElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchSearchUser, hasNextPage, page, debouncedQuery]);

  return (
    <>
      <style>{`
              @keyframes slideIn {
                from {
                  transform: translateX(-100%);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
              @keyframes slideOut {
                from {
                  transform: translateX(0);
                  opacity: 1;
                }
                to {
                  transform: translateX(-100%);
                  opacity: 0;
                }
              }
            `}</style>
      {isVisible && (
        <div
          className={`absolute ${
            !isMobile
              ? "h-screen w-screen left-[72px] bottom-0 max-w-[500px] rounded-lg"
              : "h-[calc(100%-49px)] w-full left-0 right-0"
          }  bg-[#212121] transition-all duration-300 ease-in-out transform z-30 overflow-auto`}
          style={{
            animation: `slideIn 0.3s ease-out forwards`,
          }}>
          <div className="p-4 flex flex-col gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                className="w-full bg-[#3d3d3d] text-white p-3 rounded-lg pl-10 focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <SearchIcon
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              {searchUser.length > 0 ? (
                searchUser.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex w-full items-center p-3 hover:bg-[#3d3d3d] rounded-md cursor-pointer">
                    <a
                      href={`/profile/${user.id}`}
                      className="w-full flex items-center">
                      <img
                        src={user.profilePictureUrl || "/default-avatar.png"}
                        alt={user.username}
                        className="w-12 h-12 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-white font-medium">
                          {user.userName}
                        </p>
                        <p className="text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                    </a>
                    <div className="">
                      <FollowUnfollow
                        id={user.id}
                        isFollowedByCurrentUser={user.isFollowedByCurrentUser}
                      />
                    </div>
                  </div>
                ))
              ) : debouncedQuery && !isLoading ? (
                <div className="text-center text-gray-400 p-4">
                  No users found
                </div>
              ) : null}
            </div>

            <div ref={loaderElementRef} className="h-10 w-full">
              {isLoading && (
                <div className="py-4 text-center">
                  <Loader />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
