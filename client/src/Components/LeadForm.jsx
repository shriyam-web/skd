import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LeadForm.css"; // You’ll create this file for custom styling
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

const LeadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "",
    message: "",
  });

  const propertyOptions = [
    "Flat",
    "House",
    "Plot",
    "Commercial Space",
    "Villa",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // ⏳ show spinner

    const { name, email, phone, propertyType } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const nameRegex = /^[a-zA-Z\s]{2,}$/;

    if (!nameRegex.test(name)) {
      toast.error("Please enter a valid name.");
      return setIsSubmitting(false);
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return setIsSubmitting(false);
    }

    if (!phoneRegex.test(phone)) {
      toast.error("Phone must be 10 digits.");
      return setIsSubmitting(false);
    }

    if (!propertyType) {
      toast.error("Please select a property type.");
      return setIsSubmitting(false);
    }

    try {
      const res = await fetch("http://localhost:5000/api/lead/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { message: "Invalid JSON response from server" };
      }

      if (res.ok) {
        toast.success("Form submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          propertyType: "",
          message: "",
        });
      } else {
        toast.error(data?.message || "Submission failed");
      }
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    } finally {
      setIsSubmitting(false); // ✅ hide spinner
    }
  };

  return (
    <section className="py-5 lead-form-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-6 text-uppercase mb-2 golden-text">
            Stay Updated. Be The First To Know
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Get exclusive VIP reports to help with your next real estate move
            and learn how to invest wisely!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <input
                type="text"
                name="name"
                className="custom-input"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="email"
                name="email"
                className="custom-input"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="tel"
                name="phone"
                className="custom-input"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <select
                name="propertyType"
                className="custom-input"
                value={formData.propertyType}
                onChange={handleChange}
                required
              >
                <option value="">Select Property Type</option>
                {propertyOptions.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <textarea
                name="message"
                className="custom-input"
                rows="4"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="col-12 text-center mt-4">
              <button
                type="submit"
                className="custom-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Toaster position="top-center" />
    </section>
  );
};

export default LeadForm;
