'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditorPage() {
  const router = useRouter();
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

  const handleReupload = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen p-8 sm:p-20">
      <main className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={handleReupload}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 
                dark:bg-gray-800 dark:hover:bg-gray-700
                rounded-lg transition-colors text-sm
                font-[family-name:var(--font-geist-sans)]
                flex items-center gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Reupload
            </button>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-geist-sans)]">
              Text Editor
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 
                dark:bg-gray-800 dark:hover:bg-gray-700
                rounded-lg transition-colors text-sm
                font-[family-name:var(--font-geist-sans)]"
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSharing}
              className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 
                text-white rounded-lg transition-colors text-sm
                font-[family-name:var(--font-geist-sans)]
                flex items-center gap-2
                ${isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSharing ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sharing...
                </>
              ) : (
                'Share'
              )}
            </button>
          </div>
        </div>

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
      </main>
    </div>
  );
} 