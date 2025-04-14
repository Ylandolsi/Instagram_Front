import { ChangeEvent, Dispatch, RefObject, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";

import { ImageItem } from "./ImageUploaderWithCrop";

interface StepOneProps {
  setImages: Dispatch<SetStateAction<ImageItem[]>>;
  handleRemoveImage: (index: number) => void;
  handleProceedToCrop: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  images: ImageItem[];
}

export function renderUploadStep({
  setImages,
  handleRemoveImage,
  handleProceedToCrop,
  fileInputRef,
  images,
}: StepOneProps) {
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const newImages: ImageItem[] = [];

    Array.from(fileList).forEach((file) => {
      newImages.push({
        originalUrl: URL.createObjectURL(file),
        file: file,
      });
    });

    setImages([...images, ...newImages]);
  };
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h2 className="text-2xl font-bold">Upload Images</h2>

      <div className="w-full max-w-md">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        <div
          onClick={triggerFileInput}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-800/50 transition-colors">
          <ImagePlus className="mx-auto mb-4" size={48} />
          <p>Click to select images</p>
          <p className="text-gray-400 text-sm mt-2">
            You can select multiple images
          </p>
        </div>

        {images.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-3 my-6">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.originalUrl}
                    alt={`Uploaded ${index}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1  rounded-full w-6 h-6 flex items-center justify-center "
                    aria-label="Remove image ">
                    <X size={16} className="text-red-900" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              onClick={handleProceedToCrop}
              disabled={images.length === 0}
              className="w-full mt-4">
              Continue to Crop ({images.length}{" "}
              {images.length === 1 ? "image" : "images"})
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
