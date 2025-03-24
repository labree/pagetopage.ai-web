"use client";

import { useState } from "react";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const feedbackData = {
      name: formData.get('name') || 'Anonymous',
      feedback: formData.get('feedback'),
    };

    try {
      const response = await fetch('https://www.backend.app/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);

    // TODO: Replace with your feedback submission logic
    console.log("Feedback submitted:", { name, feedback });

    // Close the modal after submission
    setIsOpen(false);
  };

  return (
    <>
      {/* Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 
          text-white rounded-full shadow-lg transition-colors
          font-[family-name:var(--font-geist-sans)] flex items-center gap-2
          z-10"
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
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Feedback
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-bold mb-4 font-[family-name:var(--font-geist-sans)] text-gray-900 dark:text-white">
              Send Feedback
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div>
                <label 
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full p-3 border rounded-lg
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Feedback Textarea */}
              <div>
                <label 
                  htmlFor="feedback"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Your Feedback
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  placeholder="Tell me what you think..."
                  className="w-full h-32 p-3 border rounded-lg
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 
                    hover:bg-gray-200 rounded-lg transition-colors
                    dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white 
                    hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
