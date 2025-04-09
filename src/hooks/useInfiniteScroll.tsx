// import { useState, useEffect } from "react";

// function useInfiniteScroll(fetchData: () => Promise<void>, threshold = 0.8) {
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     let isFetching = false;

//     const handleScroll = async () => {
//       if (isFetching) return;

//       const scrollTop =
//         document.documentElement.scrollTop || document.body.scrollTop;
//       const scrollHeight =
//         document.documentElement.scrollHeight || document.body.scrollHeight;
//       const clientHeight = document.documentElement.clientHeight;

//       if (scrollTop + clientHeight >= scrollHeight * threshold) {
//         isFetching = true;
//         setIsLoading(true);
//         await fetchData();
//         setIsLoading(false);
//         isFetching = false;
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [fetchData, threshold]);

//   return { isLoading };
// }

// export default useInfiniteScroll;
// const fetchData = async () => {
//   console.log("Fetching more data...");
//   // Simulate API call
//   await new Promise((resolve) => setTimeout(resolve, 1000));
// };

// const { isLoading } = useInfiniteScroll(fetchData);

// return (
//   <div>
//     <p>Scroll down to load more data.</p>
//     {isLoading && <p>Loading...</p>}
//   </div>
// );
