import { useState, useEffect } from "react";

const SearchBar = ({ onSearch, initialValue = "" }) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for events, concerts, sports..."
        style={{
          padding: "14px 20px 14px 48px",
          border: "none",
          borderRadius: "50px",
          width: "100%",
          fontSize: "1rem",
          outline: "none",
          boxSizing: "border-box",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          background: "#fff",
        }}
      />
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#999"
        strokeWidth="2"
        style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)" }}
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      {query && (
        <button
          onClick={() => setQuery("")}
          style={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#eee",
            border: "none",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            color: "#666",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;