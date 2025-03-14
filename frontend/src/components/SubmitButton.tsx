import React from 'react';

interface SubmitButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const SubmitButton = ({ onClick, disabled }: SubmitButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center p-4 rounded-full shadow-md bg-purple-500 text-white transition-colors hover:bg-purple-600 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label="Submit for translation"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </button>
  );
};

export default SubmitButton;
