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

  return (
    <Link to={`/events/${event._id}`}>
      <div style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", cursor: "pointer" }}>
        <img
          src={imageUrl}
          alt={event.title}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
        <div style={{ padding: "12px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 8px",
              background: "#f0f0f0",
              borderRadius: "4px",
              fontSize: "12px",
              marginBottom: "8px",
            }}
          >
            {event.category}
          </span>
          <h3 style={{ margin: "8px 0", fontSize: "18px" }}>{event.title}</h3>
          <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>
            {formatDate(event.date, "short")}
          </p>
          <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>
            {event.location}
          </p>
          <p style={{ margin: "8px 0 0", fontWeight: "bold", fontSize: "16px" }}>
            {formatPrice(event.price)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;