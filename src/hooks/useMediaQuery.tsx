// import { useState, useEffect } from "react";

// function useMediaQuery(query: string): boolean {
//   const [matches, setMatches] = useState<boolean>(
//     () => window.matchMedia(query).matches
//   );

//   useEffect(() => {
//     const mediaQueryList = window.matchMedia(query);
//     const handleChange = (event: MediaQueryListEvent) => {
//       setMatches(event.matches);
//     };

//     // Initial check
//     setMatches(mediaQueryList.matches);

//     // Listen for changes
//     mediaQueryList.addEventListener("change", handleChange);

//     // Cleanup listener on unmount
//     return () => {
//       mediaQueryList.removeEventListener("change", handleChange);
//     };
//   }, [query]);

//   return matches;
// }

// export default useMediaQuery;
// const isMobile = useMediaQuery("(max-width: 768px)");
// return <div>{isMobile ? <MobileNavigation /> : <Navbar />}</div>;
