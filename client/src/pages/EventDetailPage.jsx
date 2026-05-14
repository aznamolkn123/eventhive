import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { getUser } from "../utils/auth";

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
    const user = getUser();
    if (!user) {
      toast.error("Please login to register for events");
      return;
    }

    setRegistering(true);
    try {
      const response = await api.post(`/events/${id}/register`);
      toast.success(`Registered successfully! Ticket ID: ${response.data.ticketId}`);
      setEvent((prev) => ({
        ...prev,
        registeredCount: prev.registeredCount + 1,
      }));
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("You are already registered for this event");
      } else if (err.response?.status === 401) {
        toast.error("Please login to register");
      } else {
        toast.error(err.response?.data?.message || "Failed to register");
      }
    } finally {
      setRegistering(false);
    }
  };

  const formatPrice = (price) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  const formatEventDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <svg className="w-12 h-12 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-medium">{error}</p>
          <Link to="/dashboard" className="text-emerald-600 hover:text-emerald-700 mt-4 inline-block font-medium">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const remainingSpots = event.capacity - event.registeredCount;
  const isFull = event.registeredCount >= event.capacity;
  const isPastEvent = new Date(event.date) < new Date();
  const capacityPercentage = (event.registeredCount / event.capacity) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <div className="h-64 md:h-80 lg:h-96 bg-gradient-to-br from-emerald-600 to-emerald-800">
          {event.bannerImage ? (
            <img
              src={event.bannerImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-24 h-24 text-white opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="absolute top-4 left-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
        </div>
        
        <div className="absolute top-4 right-4">
          <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 shadow-sm">
            {event.category}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10 pb-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {isPastEvent && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                      Event Ended
                    </span>
                  )}
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                    {event.title}
                  </h1>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{formatEventDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{event.location}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">About this event</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>

                {event.organiser && (
                  <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Organised by</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold">
                        {event.organiser.name?.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-medium text-gray-900">{event.organiser.name}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:w-80 mt-8 lg:mt-0">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sticky top-24">
                  <div className="text-center mb-6">
                    <span className="text-3xl md:text-4xl font-bold text-emerald-600">
                      {formatPrice(event.price)}
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-semibold text-gray-900">{event.capacity}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          capacityPercentage >= 90 ? 'bg-red-500' :
                          capacityPercentage >= 70 ? 'bg-yellow-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">Registered</span>
                      <span className="font-medium text-gray-700">{event.registeredCount}</span>
                    </div>
                  </div>

                  <div className="mb-6 text-center">
                    {isFull ? (
                      <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl">
                        <p className="font-semibold">Event is Full</p>
                        <p className="text-sm mt-1">All spots have been taken</p>
                      </div>
                    ) : isPastEvent ? (
                      <div className="bg-gray-200 text-gray-700 px-4 py-3 rounded-xl">
                        <p className="font-semibold">Event Ended</p>
                      </div>
                    ) : (
                      <div className="bg-emerald-100 text-emerald-700 px-4 py-3 rounded-xl">
                        <p className="font-semibold">{remainingSpots} spots left</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={isFull || isPastEvent || registering}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                      isFull || isPastEvent
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg active:scale-95'
                    }`}
                  >
                    {registering ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Registering...
                      </span>
                    ) : isFull ? (
                      'Event Full'
                    ) : isPastEvent ? (
                      'Event Ended'
                    ) : (
                      'Register Now'
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-500 mt-4">
                    You'll receive a ticket confirmation via email
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;