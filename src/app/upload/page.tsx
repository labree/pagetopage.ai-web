"use client";

import { ImageUpload } from "@/components/ImageUpload";

export default function UploadPage() {
  const handleImageSelect = async (file: File | null) => {
    if (file) {
      console.log("Selected file:", file);
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
      <ImageUpload
        maxSizeInMB={5}
        acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
}
