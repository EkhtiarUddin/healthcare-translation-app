import React from 'react';

interface TranscriptDisplayProps {
  title: string;
  text: string;
  isLoading: boolean;
  loadingText: string;
  isEditable?: boolean; // Add this prop to determine if the field is editable
  onTextChange?: (text: string) => void; // Add this prop to handle text changes
}

const TranscriptDisplay = ({
  title,
  text,
  isLoading,
  loadingText,
  isEditable = false,
  onTextChange,
}: TranscriptDisplayProps) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onTextChange) {
      onTextChange(e.target.value);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-64 flex flex-col">
      <h2 className="text-lg font-medium text-gray-800 mb-2">{title}</h2>
      <div className="flex-grow overflow-auto bg-gray-50 p-3 rounded border border-gray-200">
        {isLoading ? (
          <div className="flex items-center text-gray-500">
            <svg
              className="animate-spin h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {loadingText}
          </div>
        ) : isEditable ? (
          <textarea
            className="w-full h-full p-2 text-gray-700 bg-transparent resize-none focus:outline-none"
            value={text}
            onChange={handleTextChange}
            placeholder="Type or paste text here..."
          />
        ) : text ? (
          <p className="text-gray-700">{text}</p>
        ) : (
          <p className="text-gray-400 italic">No text yet</p>
        )}
      </div>
    </div>
  );
};

export default TranscriptDisplay;
