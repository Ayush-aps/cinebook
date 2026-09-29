import { Link } from 'react-router-dom';

const MovieCard = ({ movie, showtimes }) => {
  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="card custom-card mb-4 fade-in">
      <div className="row g-0">
        <div className="col-md-3">
          <img
            src={movie.posterUrl || `https://via.placeholder.com/300x450?text=${movie.title}`}
            alt={movie.title}
            className="img-fluid rounded-start h-100 object-fit-cover"
          />
        </div>
        
        <div className="col-md-9">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h3 className="card-title fw-bold">{movie.title}</h3>
                <div className="d-flex align-items-center mb-2">
                  <span className="badge bg-primary me-2">
                    <i className="bi bi-clock me-1"></i>
                    {movie.duration} min
                  </span>
                  <span className="badge bg-info me-2">{movie.rating}</span>
                  <span className="badge bg-secondary">{movie.language}</span>
                </div>
              </div>
              <div className="text-end">
                <h4 className="text-primary fw-bold">₹{movie.price}</h4>
                <small className="text-muted">per seat</small>
              </div>
            </div>
            
            <p className="card-text text-muted mb-4">{movie.description}</p>
            
            <div className="mb-3">
              <h6 className="fw-bold mb-2">
                <i className="bi bi-calendar3 me-2"></i>
                Available Shows
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {showtimes.map((showtime) => (
                  <Link
                    key={showtime.id}
                    to={`/shows/${showtime.id}/seats`}
                    className="btn btn-outline-primary d-flex flex-column align-items-center py-2 px-3"
                  >
                    <span className="fw-bold">{formatTime(showtime.startTime)}</span>
                    <small className="text-muted">
                      <i className="bi bi-ticket-detailed me-1"></i>
                      {showtime.availableSeats} seats
                    </small>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted me-3">
                  <i className="bi bi-tags me-1"></i>
                  {movie.genre}
                </span>
              </div>
              <Link 
                to={`/shows/${showtimes[0]?.id}/seats`}
                className="btn btn-primary"
              >
                <i className="bi bi-ticket-perforated me-2"></i>
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;