// client/src/pages/BookingConfirmation.jsx
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if data was passed via location state
    if (location.state) {
      setBooking(location.state);
      setLoading(false);
    } else {
      // Fallback: Fetch from API or use mock data
      setTimeout(() => {
        setBooking({
          id: bookingId,
          movie: {
            title: "Interstellar",
            genre: "Sci-Fi, Adventure",
            language: "English",
            duration: 169,
            rating: "PG-13"
          },
          showtime: {
            theater: "Savoy 3D Cinema - Colombo",
            screen: "Screen 1",
            date: new Date(Date.now() + 86400000),
            time: "18:30",
            format: "IMAX"
          },
          seats: ["F2", "F3"], // Default seats
          totalAmount: 720,
          bookingTime: new Date(),
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}`,
          user: user
        });
        setLoading(false);
      }, 1000);
    }
  }, [bookingId, user, navigate, location]);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    // If time is already in HH:MM format, return as is
    if (typeof time === 'string' && time.includes(':')) {
      return time;
    }
    // If it's a date object
    const d = new Date(time);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Booking Not Found</h4>
          <p>We couldn't find your booking details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Success Message */}
      <div className="text-center mb-5">
        <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-4" style={{ width: '100px', height: '100px' }}>
          <i className="bi bi-check-circle-fill text-success fs-1"></i>
        </div>
        <h1 className="fw-bold mb-2">Booking Confirmed!</h1>
        <p className="text-muted lead">Your tickets have been booked successfully</p>
        <div className="badge bg-primary bg-opacity-10 text-primary fs-6 px-3 py-2">
          <i className="bi bi-receipt me-2"></i>
          Booking ID: {booking.id}
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column - Ticket Details */}
        <div className="col-lg-8">
          <div className="card border-primary border-2 shadow-lg">
            <div className="row g-0">
              {/* Movie Poster */}
              <div className="col-md-4 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center p-4">
                <i className="bi bi-qr-code-scan text-primary" style={{ fontSize: '8rem' }}></i>
              </div>
              
              {/* Booking Details */}
              <div className="col-md-8">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h2 className="card-title fw-bold">{booking.movie.title}</h2>
                      <div className="d-flex align-items-center mt-2">
                        <span className="badge bg-info me-2">{booking.movie.rating}</span>
                        <span className="text-muted">{booking.movie.genre} • {booking.movie.language}</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <h3 className="text-primary fw-bold">Rs.{booking.totalAmount}</h3>
                      <small className="text-muted">Total Paid</small>
                    </div>
                  </div>
                  
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-calendar3 text-primary fs-4 me-3"></i>
                        <div>
                          <div className="text-muted small">Date</div>
                          <div className="fw-bold">{formatDate(booking.showtime.date)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-clock text-primary fs-4 me-3"></i>
                        <div>
                          <div className="text-muted small">Time</div>
                          <div className="fw-bold">{formatTime(booking.showtime.time)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-geo-alt text-primary fs-4 me-3"></i>
                        <div>
                          <div className="text-muted small">Theater & Screen</div>
                          <div className="fw-bold">
                            {booking.showtime.theater} - {booking.showtime.screen || 'Screen 1'}
                            {booking.showtime.format && ` (${booking.showtime.format})`}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-person-circle text-primary fs-4 me-3"></i>
                        <div>
                          <div className="text-muted small">Seats</div>
                          <div className="fw-bold">{Array.isArray(booking.seats) ? booking.seats.join(', ') : 'F2, F3'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - User Info & Actions */}
        <div className="col-lg-4">
          {/* QR Code */}
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">
                <i className="bi bi-qr-code me-2"></i>
                Digital Ticket
              </h5>
              <div className="bg-light rounded p-3 mb-3">
                <img
                  src={booking.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${booking.id}`}
                  alt="QR Code"
                  className="img-fluid"
                />
              </div>
              <p className="text-muted small">
                <i className="bi bi-info-circle me-1"></i>
                Show this QR code at the theater entrance
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">
                <i className="bi bi-person-badge me-2"></i>
                Booking Information
              </h5>
              <div className="mb-3">
                <div className="text-muted small">Name</div>
                <div className="fw-bold">{booking.user?.name || user?.name}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Email</div>
                <div className="fw-bold">{booking.user?.email || user?.email}</div>
              </div>
              <div>
                <div className="text-muted small">Booking Time</div>
                <div className="fw-bold">
                  {new Date(booking.bookingTime).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;