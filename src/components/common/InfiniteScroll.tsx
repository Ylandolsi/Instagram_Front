import React from "react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

interface InfiniteScrollProps {
  children: React.ReactNode;
  loadMore: () => void;
  canLoadMore: boolean;
  isLoading: boolean;
  loader: React.ReactNode;
  endMessage: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function InfiniteScroll({
  children,
  loadMore,
  canLoadMore,
  isLoading,
  loader,
  endMessage,
  rootMargin,
  threshold,
  className,
  style,
}: InfiniteScrollProps) {
  const ref = useInfiniteScroll(loadMore, canLoadMore, isLoading);

  return (
    <div className={className} style={style}>
      {children}
      {isLoading && loader}
      {!canLoadMore && endMessage}
      {canLoadMore && <div ref={ref} style={{ height: 1 }} />}
    </div>
  );
}
