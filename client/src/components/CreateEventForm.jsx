import React, { useState } from "react";
import api from "../utils/api";

const CATEGORIES = ["music", "sports", "tech", "food", "arts", "other"];

const CreateEventForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "music",
    date: "",
    location: "",
    capacity: "",
    price: "",
  });
  const [bannerImage, setBannerImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setBannerImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("date", formData.date);
    data.append("location", formData.location);
    data.append("capacity", formData.capacity);
    data.append("price", formData.price || 0);
    if (bannerImage) {
      data.append("bannerImage", bannerImage);
    }

    try {
      await api.post("/events", data);
      setFormData({
        title: "",
        description: "",
        category: "music",
        date: "",
        location: "",
        capacity: "",
        price: "",
      });
      setBannerImage(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "4px",
    fontWeight: "bold",
    fontSize: "14px",
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
      {error && (
        <div style={{ color: "red", marginBottom: "12px" }}>{error}</div>
      )}

      <label style={labelStyle}>Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <label style={labelStyle}>Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        rows={4}
        style={{ ...inputStyle, resize: "vertical" }}
      />

      <label style={labelStyle}>Category</label>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        style={inputStyle}
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      <label style={labelStyle}>Date</label>
      <input
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <label style={labelStyle}>Location</label>
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <label style={labelStyle}>Capacity</label>
      <input
        type="number"
        name="capacity"
        value={formData.capacity}
        onChange={handleChange}
        required
        min={1}
        style={inputStyle}
      />

      <label style={labelStyle}>Price (0 for free)</label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        min={0}
        step="0.01"
        placeholder="0 for free"
        style={inputStyle}
      />

      <label style={labelStyle}>Banner Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={inputStyle}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: loading ? "#ccc" : "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
        }}
      >
        {loading ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
};

export default CreateEventForm;