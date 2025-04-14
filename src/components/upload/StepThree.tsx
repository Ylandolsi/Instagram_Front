import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { ImageItem, UploadStep } from "./ImageUploaderWithCrop";
import { Loader } from "../common/Loader";
import { toast } from "react-toastify";
import { postsApi } from "@/api/posts";

interface CaptionStepProps {
  images: ImageItem[];
  setCaption: (caption: string) => void;
  caption: string;
  setCurrentStep: (step: UploadStep) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
export const renderCaptionStep = ({
  images,
  setCaption,
  caption,
  setCurrentStep,
  loading,
  setLoading,
}: CaptionStepProps) => {
  const getFilesFromCroppedImages = async (): Promise<File[]> => {
    const files: File[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (!image.croppedUrl) continue;

      try {
        const response = await fetch(image.croppedUrl);
        const blob = await response.blob();
        const file = new File([blob], `cropped-${image.file.name}`, {
          type: "image/jpeg",
        });
        files.push(file);
      } catch (error) {
        console.error("Error converting data URL to file:", error);
      }
    }

    return files;
  };
  const handleSubmit = async () => {
    if (!caption.trim()) {
      toast.error("Please add a caption for your post");
      return;
    }

    try {
      setLoading(true);

      const allCropped = images.every((img) => !!img.croppedUrl);
      if (!allCropped) {
        toast.error("Please crop all images before submitting");
        return;
      }

      const imageFiles = await getFilesFromCroppedImages();

      await postsApi.createPost(caption, imageFiles);

      toast.success("Post created successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      images.forEach((img) => {
        URL.revokeObjectURL(img.originalUrl);
        if (img.croppedUrl) {
          URL.revokeObjectURL(img.croppedUrl);
        }
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h2 className="text-2xl font-bold">Add Caption</h2>

      <div className="w-full max-w-md">
        <div className="grid grid-cols-3 gap-3 my-6">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img.croppedUrl || img.originalUrl}
                alt={`Image ${index}`}
                className="w-full h-24 object-cover rounded"
              />
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">
            Write a caption for your post
          </label>
          <textarea
            className="w-full p-3 border rounded-md bg-[#1e1e1f] text-white min-h-[120px] focus:outline-2  focus:outline-blue-500"
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <div className="flex justify-between mt-4">
          <Button
            onClick={() => setCurrentStep(UploadStep.CROP)}
            variant="outline">
            <ArrowLeft className="mr-2" size={16} /> Back to Crop
          </Button>

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
            disabled={loading}
            className="bg-red-400/70 hover:bg-red-500">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="hover:bg-green-400">
            {loading ? <Loader /> : "Share Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};
