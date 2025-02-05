'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploadProps {
  maxSizeInMB?: number;
  acceptedFileTypes?: string[];
  className?: string;
  onImageSelect?: (file: File) => void;
}

export function ImageUpload({
  maxSizeInMB = 5,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
  onImageSelect
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    imageUrl,
    isLoading,
    error,
    handleImageSelect,
    handleDrop,
    handleDragOver,
    reset
  } = useImageUpload({ maxSizeInMB, acceptedFileTypes });

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageSelect(e.target.files);
    if (e.target.files?.[0] && onImageSelect) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative flex flex-col items-center justify-center
          w-full min-h-[200px] p-4 border-2 border-dashed
          rounded-lg cursor-pointer transition-colors
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}
          ${className}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes.join(',')}
          className="hidden"
          onChange={handleFileChange}
        />

        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : imageUrl ? (
          <div className="relative w-full aspect-video">
            <Image
              src={imageUrl}
              alt="Preview"
              fill
              className="object-contain rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full
                hover:bg-red-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop an image, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {acceptedFileTypes.join(', ').replace(/image\//g, '')} up to {maxSizeInMB}MB
            </p>
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
} 