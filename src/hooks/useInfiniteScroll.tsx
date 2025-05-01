import { useEffect, useRef } from "react";

const defaultOptions: IntersectionObserverInit = {
  root: null, // viewport (entire screen )
  rootMargin: "100px", // add 100px to space of viewport (from top && bottom)
  threshold: 0.1, // trigger when 10% of the target is visible
};
export function useInfiniteScroll(
  loadMore: () => void,
  canLoadMore: boolean,
  isLoading: boolean,
  options: IntersectionObserverInit = defaultOptions
) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canLoadMore || isLoading) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    }, options);
    const el = targetRef.current;
    if (el) obs.observe(el);
    return () => {
      if (el) obs.unobserve(el);
      obs.disconnect();
    };
  }, [loadMore, canLoadMore, options]);

  return targetRef;
}
