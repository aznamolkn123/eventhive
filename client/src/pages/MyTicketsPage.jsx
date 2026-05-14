import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './MyTicketsPage.css';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/registrations/my-tickets');
        setTickets(response.data);
      } catch (err) {
        setError('Failed to load tickets. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleCancel = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;
    
    setCancellingId(ticketId);
    try {
      await api.delete(`/registrations/${ticketId}`);
      setTickets(tickets.filter(t => t._id !== ticketId));
      window.dispatchEvent(new CustomEvent('toast', { 
        detail: { message: 'Registration cancelled successfully', type: 'success' } 
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setCancellingId(null);
    }
  };

  const handlePrint = (ticketId) => {
    document.querySelectorAll('.printable-ticket').forEach((el) => {
      el.classList.remove('printing');
    });
    const ticketEl = document.querySelector(`[data-ticket-id="${ticketId}"]`);
    if (ticketEl) {
      ticketEl.classList.add('printing');
    }
    window.print();
  };

  const formatEventDate = (date) => {
    if (!date) return 'Date not available';
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
      <div className="loading-state">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mytickets-page">
      <div className="mytickets-header">
        <h1>My Tickets</h1>
        <p>View and manage your event registrations</p>
      </div>

      {error && (
        <div className="error-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h3>No tickets yet</h3>
          <p>You haven't booked any events yet. Start exploring!</p>
          <Link to="/dashboard" className="btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="ticket-grid">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              data-ticket-id={ticket._id}
              className="ticket-card printable-ticket"
            >
              <div className="ticket-banner">
                {ticket.event?.banner ? (
                  <img src={ticket.event.banner} alt={ticket.event.title} />
                ) : (
                  <div className="ticket-banner-placeholder">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <span className={`ticket-status-badge ${ticket.status || 'confirmed'}`}>
                  {ticket.status || 'confirmed'}
                </span>
              </div>

              <div className="ticket-content">
                <h2 className="ticket-title">{ticket.event?.title || 'Event'}</h2>
                
                <div className="ticket-meta">
                  <div className="ticket-meta-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatEventDate(ticket.event?.date)}
                  </div>
                  <div className="ticket-meta-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {ticket.event?.location || 'Location not available'}
                  </div>
                </div>

                <div className="ticket-details">
                  <div className="ticket-id-section">
                    <span className="ticket-id-label">Ticket ID</span>
                    <span className="ticket-id-value">{ticket.ticketId}</span>
                  </div>
                  
                  {ticket.qrCodeData && (
                    <div className="ticket-qr-section">
                      <img src={ticket.qrCodeData} alt="QR Code" />
                    </div>
                  )}
                </div>

                <div className="ticket-actions">
                  <button
                    onClick={() => handlePrint(ticket._id)}
                    className="ticket-btn ticket-btn-primary"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                  <button
                    onClick={() => handleCancel(ticket._id)}
                    className="ticket-btn ticket-btn-danger"
                    disabled={cancellingId === ticket._id}
                  >
                    {cancellingId === ticket._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;