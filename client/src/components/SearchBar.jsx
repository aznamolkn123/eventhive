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
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search events..."
      style={{
        padding: "10px 16px",
        border: "1px solid #ddd",
        borderRadius: "24px",
        width: "100%",
        maxWidth: "400px",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
};

export default SearchBar;