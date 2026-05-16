import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";
import EventSkeleton from "../components/EventSkeleton";
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

  const categoryIcons = {
    All: "🎫",
    music: "🎵",
    sports: "⚽",
    tech: "💻",
    food: "🍽️",
    arts: "🎨",
    other: "📌",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", width: "100%", overflowX: "hidden" }}>
      <div
        style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, #1a8f6e 100%)",
          padding: "100px 24px 60px",
          textAlign: "center",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            opacity: 0.5,
          }}
        />
        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, margin: "0 0 12px", color: "#fff" }}>
            Discover Amazing Events
          </h1>
          <p style={{ fontSize: "1.125rem", opacity: 0.9, margin: "0 0 32px", color: "#e0e0e0" }}>
            Find and book tickets for concerts, sports, tech meetups, and more
          </p>
          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, margin: "0 0 16px", color: "var(--color-text)" }}>
            Browse by Category
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "50px",
                  background: activeCategory === cat.value ? "var(--color-primary)" : "#fff",
                  color: activeCategory === cat.value ? "#fff" : "var(--color-text)",
                  cursor: "pointer",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  boxShadow: activeCategory === cat.value ? "0 4px 12px rgba(15, 110, 86, 0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "all 0.2s ease",
                }}
              >
                <span>{categoryIcons[cat.value]}</span>
                {cat.label}
              </button>
            ))}
            {(searchQuery || activeCategory !== "All") && (
              <button
                onClick={clearFilters}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 20px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "50px",
                  background: "#fff",
                  color: "var(--color-text)",
                  cursor: "pointer",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : events.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p style={{ color: "#666", marginBottom: "16px", fontSize: "1.0625rem" }}>
              No events found matching your criteria
            </p>
            <button
              onClick={clearFilters}
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                background: "var(--color-primary)",
                color: "#fff",
                cursor: "pointer",
                fontSize: "0.9375rem",
                fontWeight: 500,
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p style={{ marginBottom: "24px", color: "#666", fontSize: "0.9375rem" }}>
              Showing <strong style={{ color: "var(--color-text)" }}>{events.length}</strong> event{events.length !== 1 ? "s" : ""}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;