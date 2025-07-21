import React from "react";
import "./LoadingSpinner.css";

function LoadingSpinner() {
  return (
    <div className="loading-spinner-wrapper d-flex justify-content-center align-items-center">
      <div className="spinner-border text-warning spinner-lg" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="loading-text mt-3 ms-3">
        <h5 className="text-warning fw-semibold fade-in-text">Loading...</h5>
      </div>
    </div>
  );
}

export default LoadingSpinner;
