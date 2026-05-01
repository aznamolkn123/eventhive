import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { formatDate } from "../utils/formatDate";

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const response = await api.post(`/events/${id}/register`);
      toast.success(`Registered! Ticket ID: ${response.data.ticketId}`);
      setEvent((prev) => ({
        ...prev,
        registeredCount: prev.registeredCount + 1,
      }));
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("You are already registered");
      } else {
        toast.error(err.response?.data?.message || "Failed to register");
      }
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        {error}
      </div>
    );
  }

  const formatPrice = (price) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  const remainingSpots = event.capacity - event.registeredCount;
  const isFull = event.registeredCount >= event.capacity;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <img
        src={event.bannerImage || "https://placehold.co/800x400?text=No+Image"}
        alt={event.title}
        style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px" }}
      />
      <span
        style={{
          display: "inline-block",
          padding: "4px 8px",
          background: "#f0f0f0",
          borderRadius: "4px",
          fontSize: "12px",
          marginTop: "16px",
        }}
      >
        {event.category}
      </span>
      <h1 style={{ margin: "16px 0" }}>{event.title}</h1>
      <p style={{ color: "#666", marginBottom: "8px" }}>
        {formatDate(event.date, "long")} | {event.location}
      </p>
      <p style={{ color: "#666", marginBottom: "16px" }}>
        {remainingSpots} spots left
      </p>
      <p style={{ marginBottom: "20px" }}>{event.description}</p>
      <p style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        {formatPrice(event.price)}
      </p>
      <button
        onClick={handleRegister}
        disabled={isFull || registering}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          background: isFull ? "#ccc" : "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: isFull ? "not-allowed" : "pointer",
        }}
      >
        {isFull ? "Event Full" : registering ? "Registering..." : "Register for this Event"}
      </button>
    </div>
  );
};

export default EventDetailPage;