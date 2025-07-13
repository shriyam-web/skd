import React, { useEffect, useState } from "react";
import "./visitor_count.css";

function Visitor_Count() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const hasVisited = sessionStorage.getItem("visitorCounted");

    const endpoint = hasVisited
      ? `${BASE_URL}/api/visitor-count`
      : `${BASE_URL}/api/visitor-count/increment`;

    const fetchOptions = hasVisited
      ? {} // default is GET
      : { method: "POST" };

    fetch(endpoint, fetchOptions)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch visitor count");
        return res.json();
      })
      .then((data) => {
        setCount(data.count);
        if (!hasVisited) sessionStorage.setItem("visitorCounted", "true");
      })
      .catch((err) => {
        console.error("Visitor-count fetch error:", err);
        setCount("N/A");
      });
  }, []);

  return (
    <div className="visitor-widget">
      <code>
        {" "}
        <div className="label">Visitors Count</div>{" "}
      </code>

      {count === null ? (
        <div className="loading">Loading…</div>
      ) : (
        <div className="value">
          {/* <i className="bi bi-person-fill me-2 text-warning"></i> */}
          <code>
            {" "}
            {typeof count === "number" ? count.toLocaleString() : count}{" "}
          </code>
        </div>
      )}
    </div>
  );
}

export default Visitor_Count;
