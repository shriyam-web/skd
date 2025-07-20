import React from "react";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          <span className="text-blue-500 font-semibold text-sm">Loading</span>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
