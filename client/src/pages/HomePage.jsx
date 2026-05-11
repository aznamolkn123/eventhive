import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const CATEGORIES = [
  { label: "All", value: "All" },
  { label: "Music", value: "music" },
  { label: "Sports", value: "sports" },
  { label: "Tech", value: "tech" },
  { label: "Food", value: "food" },
  { label: "Arts", value: "arts" },
  { label: "Other", value: "other" },
];

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (activeCategory && activeCategory !== "All") params.category = activeCategory;
        const response = await api.get("/events", { params });
        setEvents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchParams]);

  const handleSearch = (query) => {
    const newParams = {};
    if (query) newParams.search = query;
    if (activeCategory && activeCategory !== "All") newParams.category = activeCategory;
    setSearchParams(newParams);
  };

  const handleCategoryClick = (category) => {
    const newParams = {};
    if (searchQuery) newParams.search = searchQuery;
    if (category !== "All") newParams.category = category;
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Upcoming Events</h1>

      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "200px", maxWidth: "400px" }}>
          <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
        </div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryClick(cat.value)}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: "20px",
              background: activeCategory === cat.value ? "#007bff" : "#fff",
              color: activeCategory === cat.value ? "#fff" : "#333",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {cat.label}
          </button>
        ))}
        <button
          onClick={clearFilters}
          style={{
            padding: "8px 16px",
            border: "1px solid #ddd",
            borderRadius: "20px",
            background: "#fff",
            color: "#666",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : events.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "#666", marginBottom: "16px" }}>No events found — try clearing your filters</p>
          <button
            onClick={clearFilters}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: "20px",
              background: "#fff",
              color: "#333",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: "16px", color: "#666" }}>Showing {events.length} events</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;