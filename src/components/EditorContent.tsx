'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export function EditorContent() {
  const searchParams = useSearchParams();
  const [text, setText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const initialText = searchParams.get('text');
    if (initialText) {
      setText(decodeURIComponent(initialText));
    }
  }, [searchParams]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSave = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Shared Text',
          text: text,
        });
      } else {
        // Fallback to copy if Web Share API is not available
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to share:', err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full border rounded-lg dark:border-gray-700">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-[70vh] p-6 rounded-lg 
          font-mono text-base bg-transparent
          focus:outline-none focus:ring-2 focus:ring-blue-500
          dark:text-gray-200 resize-none"
        placeholder="No text received from server..."
      />
    </div>
  );
} 