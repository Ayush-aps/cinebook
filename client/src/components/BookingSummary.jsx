const BookingSummary = ({ 
  movie, 
  showtime, 
  selectedSeats, 
  pricePerSeat, 
  onConfirm, 
  loading = false 
}) => {
  const totalPrice = selectedSeats.length * pricePerSeat;

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="card shadow-lg position-sticky" style={{ top: '100px' }}>
      <h4 className="card-header bg-primary text-white">
        <i className="bi bi-cart-check me-2"></i>
        Booking Summary
      </h4>
      
      <div className="card-body">
        {/* Movie Info */}
        <div className="border-bottom pb-3 mb-3">
          <h5 className="fw-bold">{movie.title}</h5>
          <div className="d-flex text-muted mb-2">
            <span className="me-3">
              <i className="bi bi-calendar3 me-1"></i>
              {formatDate(showtime.startTime)}
            </span>
            <span>
              <i className="bi bi-clock me-1"></i>
              {formatTime(showtime.startTime)}
            </span>
          </div>
          <div className="small text-muted">
            {movie.genre} • {movie.language}
          </div>
        </div>

        {/* Seat Selection */}
        <div className="border-bottom pb-3 mb-3">
          <h6 className="fw-bold mb-2">Selected Seats</h6>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {selectedSeats.map((seat) => (
              <span
                key={seat}
                className="badge bg-primary bg-opacity-10 text-white fs-6 py-2 px-3"
              >
                {seat}
              </span>
            ))}
          </div>
          <p className="small text-muted mb-0">
            <i className="bi bi-check-circle me-1"></i>
            {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
          </p>
        </div>

        {/* Price Breakdown */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Price per seat:</span>
            <span className="fw-bold">Rs. {pricePerSeat}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Number of seats:</span>
            <span className="fw-bold">{selectedSeats.length}</span>
          </div>
          {selectedSeats.length > 1 && (
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal:</span>
              <span className="fw-bold">Rs. {selectedSeats.length * pricePerSeat}</span>
            </div>
          )}
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Booking Fee:</span>
            <span className="fw-bold">Rs. 20</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between fs-5 fw-bold">
            <span>Total Amount:</span>
            <span className="text-primary">Rs. {totalPrice + 20}</span>
          </div>
        </div>

        {/* Concurrency Warning */}
        <div className="alert alert-warning mb-4">
          <div className="d-flex">
            <i className="bi bi-clock-history me-2"></i>
            <div className="small">
              <strong>Note:</strong> Seats are held for 2 minutes. Complete payment before time expires.
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          disabled={selectedSeats.length === 0 || loading}
          className="btn btn-primary btn-lg w-100 py-3"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            <>
              <i className="bi bi-lock-fill me-2"></i>
              Confirm Booking - Rs. {totalPrice + 20}
            </>
          )}
        </button>

        {/* Safety Info */}
        <div className="text-center mt-3 small text-muted">
          <p className="mb-1">
            <i className="bi bi-shield-check me-1"></i>
            Your booking is secured across multiple distributed servers
          </p>
          <p className="mb-0">
            Double-booking protection • Automatic failover • 100% secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
