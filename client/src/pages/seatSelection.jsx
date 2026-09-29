// client/src/pages/SeatSelection.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import SeatGrid from '../components/SeatGrid';
import BookingSummary from '../components/BookingSummary';
import toast from 'react-hot-toast';

const SeatSelection = () => {
  const { showId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get data passed from Shows page
  const {
    movieId,
    movieTitle,
    theatre,
    date,
    time,
    format,
    price,
    city
  } = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatStatus, setSeatStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);

  // Generate unique key for storing seats in localStorage per movie+showtime
  const seatKey = `seats_${movieId || showId}_${date}_${time}`;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // If no data passed, redirect back
    if (!movieTitle || !theatre) {
      navigate('/shows');
      return;
    }

    // Check if showtime is in the past
    // const showDateTime = new Date(`${date} ${time}`);
    // const now = new Date();
    // if (showDateTime < now) {
    //   toast.error('This show has already started or finished.');
    //   navigate('/shows');
    //   return;
    // }

    fetchShowDetails();

    // Listen to localStorage changes for cross-tab seat hold sync
    const handleStorageChange = (event) => {
      if (event.key === seatKey && event.newValue) {
        setSeatStatus(JSON.parse(event.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (selectedSeats.length > 0) {
        releaseSeatHolds();
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchShowDetails = () => {
    try {
      // Movie data
      const movieData = {
        id: movieId || showId,
        title: movieTitle || "Interstellar",
        description: "A team of explorers travel through a wormhole in space.",
        duration: 169,
        rating: "PG-13",
        genre: "Sci-Fi, Adventure",
        language: "English",
        price: price || 350,
        posterUrl: `https://via.placeholder.com/300x450/0d6efd/FFFFFF?text=${encodeURIComponent(movieTitle || "Movie")}`
      };

      const showtimeData = {
        id: showId,
        startTime: new Date(`${date} ${time}`),
        theater: theatre,
        format: format,
        city: city
      };

      setMovie(movieData);
      setShowtime(showtimeData);

      // Load seat status from localStorage if exists
      const savedSeats = localStorage.getItem(seatKey);
      if (savedSeats) {
        setSeatStatus(JSON.parse(savedSeats));
      } else {
        // Initialize seat status randomly
        const initialStatus = {};
        const rows = 8;
        const cols = 10;
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
            initialStatus[seatId] = Math.random() < 0.3 ? 'booked' : 'available';
          }
        }
        setSeatStatus(initialStatus);
        localStorage.setItem(seatKey, JSON.stringify(initialStatus));
      }

    } catch (error) {
      toast.error('Failed to load show details');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seatId) => {
    const currentStatus = seatStatus[seatId];

    if (currentStatus === 'booked') {
      toast.error(`Seat ${seatId} is already booked`);
      return;
    }

    let updatedStatus = { ...seatStatus };
    let updatedSelected = [...selectedSeats];

    if (selectedSeats.includes(seatId)) {
      // Deselect seat
      updatedSelected = updatedSelected.filter(id => id !== seatId);
      updatedStatus[seatId] = 'available';
    } else {
      // Select seat - put on hold
      updatedSelected.push(seatId);
      updatedStatus[seatId] = 'hold';
      toast.success(`Seat ${seatId} held for 2 minutes`);

      // Auto-release hold after 2 minutes
      setTimeout(() => {
        setSeatStatus(prev => {
          if (prev[seatId] === 'hold' && !updatedSelected.includes(seatId)) {
            const newStatus = { ...prev, [seatId]: 'available' };
            localStorage.setItem(seatKey, JSON.stringify(newStatus));
            return newStatus;
          }
          return prev;
        });
      }, 120000);
    }

    setSelectedSeats(updatedSelected);
    setSeatStatus(updatedStatus);
    localStorage.setItem(seatKey, JSON.stringify(updatedStatus));
  };

  const releaseSeatHolds = () => {
    const updatedStatus = { ...seatStatus };
    selectedSeats.forEach(seatId => {
      if (updatedStatus[seatId] === 'hold') {
        updatedStatus[seatId] = 'available';
      }
    });
    setSeatStatus(updatedStatus);
    localStorage.setItem(seatKey, JSON.stringify(updatedStatus));
    setSelectedSeats([]);
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setConfirming(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create booking data
      const bookingData = {
        bookingId: `BK${Date.now()}`,
        movie: movie,
        showtime: showtime,
        seats: selectedSeats,
        totalAmount: (movie.price * selectedSeats.length) + 20,
        bookingTime: new Date(),
        user: user
      };

      // Mark seats as booked
      const updatedStatus = { ...seatStatus };
      selectedSeats.forEach(seatId => {
        updatedStatus[seatId] = 'booked';
      });
      setSeatStatus(updatedStatus);
      localStorage.setItem(seatKey, JSON.stringify(updatedStatus));
      setSelectedSeats([]);

      // Navigate to confirmation with all data
      navigate(`/booking/${bookingData.bookingId}/confirm`, {
        state: bookingData
      });

    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading seat layout...</p>
      </div>
    );
  }

  return (
    <div className="container py-4 fade-in">
      {/* Header with show details */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/shows')}
          className="btn btn-outline-primary mb-3"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Shows
        </button>

        <h1 className="fw-bold">
          Select Seats for <span className="text-primary">{movie.title}</span>
        </h1>

        <div className="d-flex flex-wrap gap-3 mt-2">
          <div className="d-flex align-items-center">
            <i className="bi bi-geo-alt text-muted me-2"></i>
            <span className="fw-bold">Theater:</span> {showtime.theater}
          </div>
          <div className="d-flex align-items-center">
            <i className="bi bi-calendar3 text-muted me-2"></i>
            <span className="fw-bold">Date:</span> {date}
          </div>
          <div className="d-flex align-items-center">
            <i className="bi bi-clock text-muted me-2"></i>
            <span className="fw-bold">Time:</span> {time}
          </div>
          {showtime.format && (
            <div className="d-flex align-items-center">
              <span className="badge bg-info">{showtime.format}</span>
            </div>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* Seat Selection */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-grid-3x3-gap me-2"></i>
                Select Seats
              </h5>
            </div>
            <div className="card-body">
              <SeatGrid
                rows={8}
                cols={10}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
                seatStatus={seatStatus}
              />
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="col-lg-4">
          {movie && showtime && (
            <BookingSummary
              movie={movie}
              showtime={showtime}
              selectedSeats={selectedSeats}
              pricePerSeat={movie.price}
              onConfirm={handleConfirmBooking}
              loading={confirming}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
