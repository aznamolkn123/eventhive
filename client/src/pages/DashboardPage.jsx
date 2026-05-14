import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { getUser } from "../utils/auth";
import { formatDate } from "../utils/formatDate";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import CreateEventForm from "../components/CreateEventForm";

const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchEvents = async () => {
    try {
      const user = getUser();
      const response = await api.get("/events", {
        params: { organiser: user?._id },
      });
      setEvents(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await api.delete(`/events/${eventId}`);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>My Events</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showCreateForm ? "Cancel" : "Create New Event"}
        </button>
      </div>

      {showCreateForm && (
        <div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <CreateEventForm onSuccess={() => {
            setShowCreateForm(false);
            fetchEvents();
          }} />
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {events.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <p>No events yet</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {events.map((event) => (
            <div
              key={event._id}
              style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}
            >
              <h3 style={{ margin: "0 0 8px" }}>{event.title}</h3>
              <p style={{ margin: "4px 0", color: "#666" }}>
                {formatDate(event.date, "short")}
              </p>
              <p style={{ margin: "8px 0", fontWeight: "bold" }}>
                {event.registeredCount || 0} / {event.capacity || 0} registered
              </p>
              <button
                onClick={() => handleDelete(event._id)}
                style={{
                  padding: "8px 16px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;