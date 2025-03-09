'use client';

import { ImageUpload } from "@/components/ImageUpload";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [hasImage, setHasImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = async (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setHasImage(false);
      return;
    }
    console.log('Selected file:', file);
    setSelectedFile(file);
    setHasImage(true);
  };

  const handleConfirm = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      // Convert to PNG if not already PNG
      const canvas = document.createElement('canvas');
      const img = new Image();
      
      img.src = URL.createObjectURL(selectedFile);
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image'));
      });

      // Clean up the object URL
      URL.revokeObjectURL(img.src);

      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      ctx.drawImage(img, 0, 0);
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png');
      });

      // Add a check to ensure blob was created
      if (!blob || blob.size === 0) {
        throw new Error('Created blob is empty');
      }

      // Log the blob size to help debug
      console.log('Blob size:', blob.size);

      // Create form data
      const formData = new FormData();
      formData.append('images', blob, 'image.png');

      const response = await fetch('https://backend-830284147363.us-east1.run.app/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed: ' + response.statusText);
      }

      const data = await response.json();
      
      // Extract the text from the first result
      //const text = data.results[0].text;
      const text = data.results[0].formatted_text;
      
      // Navigate to editor with the text
      router.push(`/editor?text=${encodeURIComponent(text)}`);
    } catch (error) {
      console.error('Upload error:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 sm:p-20">
      <main className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 font-[family-name:var(--font-geist-sans)]">
            PageToPage.ai
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 font-[family-name:var(--font-geist-mono)]">
            Upload your images in JPEG, PNG, or WebP format. Maximum file size is 10MB.
          </p>
        </div>

        <ImageUpload
          maxSizeInMB={10}
          acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
          onImageSelect={handleImageSelect}
          className="bg-background dark:bg-[#111]"
        />

        {hasImage && (
          <button
            onClick={handleConfirm}
            disabled={isUploading}
            className={`mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 
              text-white font-semibold rounded-lg transition-colors
              font-[family-name:var(--font-geist-sans)]
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              flex items-center justify-center gap-2`}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Converting...
              </>
            ) : (
              'Confirm'
            )}
          </button>
        )}
      </main>
    </div>
  );
}
