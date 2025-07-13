// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="text-center py-5 bg-light text-secondary notproj">
      <div className="spinner-container">
        <div className="custom-spinner"></div>
      </div>
      Oops! It seems like something went wrong — we're on it. <br />
      <div>
        If it takes too long, kindly check the URL or &nbsp;
        <Link to="/">Go Home</Link>
      </div>
      <br /> <br />
      <div>
        {/* <i className="fa fa-copyright" aria-hidden="true"></i>
        &nbsp;SKD PropWorld */}
        <p className="small text-muted mb-0">&copy; SKD PropWorld</p>
      </div>
    </div>
  );
};

export default NotFound;
