'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FeedbackButton } from '@/components/FeedbackButton';

// Dynamically import EditorContent with no SSR
const EditorContent = dynamic(() => import('@/components/EditorContent').then(mod => mod.EditorContent), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function EditorPage() {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const getStoredImage = () => {
    return sessionStorage.getItem('originalImage');
  };

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('originalImage');
    };
  })
  
  const handleReupload = () => {
    router.push('/');
  };

  const handleCopy = async () => {
    try {
      const text = new URLSearchParams(window.location.search).get('text') || '';
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSave = async () => {
    setIsSharing(true);
    try {
      const text = new URLSearchParams(window.location.search).get('text') || '';
      if (navigator.share) {
        await navigator.share({ title: 'Shared Text', text });
      } else {
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
    <div className="min-h-screen p-8 sm:p-20">
      <FeedbackButton />
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

        <Suspense fallback={<div>Loading...</div>}>
          <EditorContent />
        </Suspense>
      </main>
    </div>
  );
} 