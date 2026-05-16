import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

const EventCard = ({ event }) => {
  const formatPrice = (price) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  const imageUrl = event. bannerImage
    ? event.bannerImage. startsWith("http")
      ? event.bannerImage
      : `${window.location.origin}${event.bannerImage}`
    : "https://placehold. co/600x400?text=No+Image";

  const categoryColors = {
    music: { bg: "#fce7f3", color: "#be185d" },
    sports: { bg: "#dbeafe", color: "#1d4ed8" },
    tech: { bg: "#e0e7ff", color: "#4338ca" },
    food: { bg: "#fef3c7", color: "#d97706" },
    arts: { bg: "#f3e8ff", color: "#7c3aed" },
    other: { bg: "#f1f5f9", color: "#475569" },
  };

  const catStyle = categoryColors[event.category] || categoryColors.other;

  return (
    <Link to={`/events/${event._id}`} style={{ textDecoration: "none" }}>
      <div
        className="event-card"
        style={{
          background: "#fff",
          borderRadius: "16px",
          overflow: "hidden",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div style={{ position: "relative", height: "180px" }}>
          <img
            src={imageUrl}
            alt={`${event.title} - ${event.category} event at ${event.location}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <span
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              padding: "6px 12px",
              background: catStyle.bg,
              color: catStyle.color,
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {event.category}
          </span>
        </div>
        <div style={{ padding: "16px" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", lineHeight: 1.3 }}>
            {event.title}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", color: "#666", fontSize: "0.875rem" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {formatDate(event.date, "short")}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", color: "#666", fontSize: "0.875rem" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {event.location}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--color-border)" }}>
            <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--color-primary)" }}>
              {formatPrice(event.price)}
            </span>
            <span style={{ fontSize: "0.8125rem", color: "#666", fontWeight: 500 }}>
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;