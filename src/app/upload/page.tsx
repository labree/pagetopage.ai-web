'use client';

import { ImageUpload } from '@/components/ImageUpload';

export default function UploadPage() {
  const handleImageSelect = async (file: File) => {
    // Here you would typically upload the file to your server
    // Example:
    // const formData = new FormData();
    // formData.append('image', file);
    // const response = await fetch('/api/upload', {
    //   method: 'POST',
    //   body: formData,
    // });
    console.log('Selected file:', file);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
      <ImageUpload
        maxSizeInMB={5}
        acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
} 