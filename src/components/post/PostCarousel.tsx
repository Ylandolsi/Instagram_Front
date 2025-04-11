import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Image } from "@/types/image.type";

export function CarouselImage({ images }: { images: Image[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="mx-auto max-w-[700px]">
      <Carousel setApi={setApi} className="relative max-w-[470px]">
        <CarouselContent>
          {images.map((lnk, index) => (
            <CarouselItem key={index} className="">
              <div className="flex justify-center items-center w-full h-full">
                <img src={lnk.url} alt={`Image ${index + 1}`} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-1 text-black border-none outline-none  " />
        <CarouselNext className="absolute right-1  text-black border-none outline-none " />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        {current} of {count}
      </div>
    </div>
  );
}
