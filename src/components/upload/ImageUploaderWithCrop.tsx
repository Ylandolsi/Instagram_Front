import React, { useState, useRef } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { toast, ToastContainer } from "react-toastify";
import { renderUploadStep } from "./StepOne";
import { renderCropStep } from "./StepTwo";
import { Crop } from "react-image-crop";
import { renderCaptionStep } from "./StepThree";
import { useNavigate } from "react-router-dom";

/**
 * to upload files :
 * *      - we convert them temporary to objectUrls
 *           ( => allowing browser to access them without uploading to server)
 * *      - we convert them back to files when we want to upload them
 * *      - when we are done with the objectUrls, we need to revoke them
 *          ( => to free up memory)
 */
export type ImageItem = {
  originalUrl: string;
  croppedUrl?: string;
  file: File;
  crop?: Crop;
};

export enum UploadStep {
  UPLOAD = 0,
  CROP = 1,
  CAPTION = 2,
}

const ImageUploaderWithCrop: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<UploadStep>(UploadStep.UPLOAD);
  const [images, setImages] = useState<ImageItem[]>([]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [caption, setCaption] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper function to center the crop

  // Trigger file input click

  // Move to crop step
  const handleProceedToCrop = () => {
    if (images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }
    setCurrentStep(UploadStep.CROP);
  };

  const handleNextImage = () => {
    if (!images[activeImageIndex].croppedUrl) {
      toast.warning("Please complete cropping this image first");
      return;
    }

    if (activeImageIndex < images.length - 1) {
      setActiveImageIndex(activeImageIndex + 1);
    } else {
      setCurrentStep(UploadStep.CAPTION);
    }
  };

  const handlePreviousImage = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    }
  };

  // Convert cropped image URLs back to files

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];

    // Release object URLs to prevent memory leaks
    URL.revokeObjectURL(newImages[index].originalUrl);
    if (newImages[index].croppedUrl) {
      URL.revokeObjectURL(newImages[index].croppedUrl);
    }

    newImages.splice(index, 1);
    setImages(newImages);

    if (index <= activeImageIndex && activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    }
    if (newImages.length === 0) {
      setCurrentStep(UploadStep.UPLOAD);
    }
  };

  const renderStep1 = () => {
    return renderUploadStep({
      setImages,
      handleRemoveImage,
      handleProceedToCrop,
      fileInputRef,
      images,
    });
  };

  const renderStep2 = () => {
    return renderCropStep({
      images,
      activeImageIndex,
      setImages,
      imgRef,
      handlePreviousImage,
      handleNextImage,
    });
  };

  const renderStep3 = () => {
    return renderCaptionStep({
      images,
      setCaption,
      caption,
      setCurrentStep,
      loading,
      setLoading,
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case UploadStep.UPLOAD:
        return renderStep1();
      case UploadStep.CROP:
        return renderStep2();
      case UploadStep.CAPTION:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="w-full mx-auto max-w-2xl py-8">
      {renderCurrentStep()}
      <ToastContainer />
    </div>
  );
};

export default ImageUploaderWithCrop;
