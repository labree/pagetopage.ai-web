import { useState, useCallback } from 'react';

interface UseImageUploadOptions {
  maxSizeInMB?: number;
  acceptedFileTypes?: string[];
}

interface UseImageUploadReturn {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  handleImageSelect: (files: FileList | null) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  reset: () => void;
}

export function useImageUpload({
  maxSizeInMB = 10,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp']
}: UseImageUploadOptions = {}): UseImageUploadReturn {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedFileTypes.includes(file.type)) {
      return 'Invalid file type. Please upload a valid image.';
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return `File size too large. Maximum size is ${maxSizeInMB}MB.`;
    }

    return null;
  }, [acceptedFileTypes, maxSizeInMB]);

  const processFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);

      // Cleanup previous URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setImageUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, [validateFile]);

  const handleImageSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    processFile(files[0]);
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleImageSelect(files);
  }, [handleImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const reset = useCallback(() => {
    setImageUrl(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    imageUrl,
    isLoading,
    error,
    handleImageSelect,
    handleDrop,
    handleDragOver,
    reset
  };
} 