import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { ImageItem } from "./ImageUploaderWithCrop";

interface StepTwoProps {
  images: ImageItem[];
  activeImageIndex: number;
  setImages: (images: ImageItem[]) => void;
  imgRef: React.RefObject<HTMLImageElement | null>;
  handlePreviousImage: () => void;
  handleNextImage: () => void;
}

export const renderCropStep = ({
  images,
  activeImageIndex,
  setImages,
  imgRef,
  handlePreviousImage,
  handleNextImage,
}: StepTwoProps) => {
  function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
  ) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }
  const getCroppedImg = (
    image: HTMLImageElement,
    cropData: PixelCrop
  ): Promise<string> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = cropData.width;
    canvas.height = cropData.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      image,
      cropData.x * scaleX,
      cropData.y * scaleY,
      cropData.width * scaleX,
      cropData.height * scaleY,
      0,
      0,
      cropData.width,
      cropData.height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  };

  // Handle image loading for cropping
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    imgRef.current = e.currentTarget;

    const newCrop = centerAspectCrop(width, height, 1);

    const updatedImages = [...images];
    updatedImages[activeImageIndex].crop = newCrop;
    setImages(updatedImages);
  };

  // Complete cropping for current image
  const handleCropComplete = async (cropData: PixelCrop) => {
    if (imgRef.current && cropData.width && cropData.height) {
      const croppedImage = await getCroppedImg(imgRef.current, cropData);

      const updatedImages = [...images];
      updatedImages[activeImageIndex].croppedUrl = croppedImage;
      setImages(updatedImages);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h2 className="text-2xl font-bold">
        Crop Image {activeImageIndex + 1} of {images.length}
      </h2>

      {images.length > 0 && (
        <div className="w-full max-w-md">
          <div
            className="flex flex-col mb-6"
            style={{ maxWidth: "500px", margin: "20px auto" }}>
            <ReactCrop
              crop={images[activeImageIndex].crop}
              aspect={1}
              onChange={(c) => {
                const updatedImages = [...images];
                updatedImages[activeImageIndex].crop = c;
                setImages(updatedImages);
              }}
              onComplete={handleCropComplete}
              className=""
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#000",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}>
              <img
                ref={imgRef}
                src={images[activeImageIndex].originalUrl}
                onLoad={handleImageLoad}
                alt="Upload"
                style={{
                  transformOrigin: "center",
                  maxHeight: "500px",
                }}
              />
            </ReactCrop>
          </div>

          {images[activeImageIndex].croppedUrl && (
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-sm text-gray-400">Preview:</h3>
              <img
                src={images[activeImageIndex].croppedUrl}
                alt="Cropped Preview"
                className="max-w-[200px] h-auto mx-auto border rounded"
              />
            </div>
          )}

          <div className="flex justify-between mt-4">
            {activeImageIndex > 0 ? (
              <Button
                onClick={handlePreviousImage}
                disabled={activeImageIndex === 0}
                variant="outline">
                <ArrowLeft className="mr-2" size={16} /> Previous
              </Button>
            ) : (
              <Button
                onClick={() => {
                  images.forEach((img) => {
                    URL.revokeObjectURL(img.originalUrl);
                    if (img.croppedUrl) {
                      URL.revokeObjectURL(img.croppedUrl);
                    }
                  });
                  toast.info("Post creation canceled");
                  window.location.href = "/";
                }}
                className="bg-red-400/70 hover:bg-red-500">
                Cancel
              </Button>
            )}

            <Button onClick={handleNextImage}>
              {activeImageIndex < images.length - 1 ? (
                <>
                  Next <ArrowRight className="ml-2" size={16} />
                </>
              ) : (
                "Continue to Caption"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
