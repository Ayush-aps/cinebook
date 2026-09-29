import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const Home = () => {
  const { user } = useAuth();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sri Lanka Cities
  const [cities] = useState([
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo',
    'Kurunegala', 'Matara', 'Anuradhapura', 'Trincomalee', 'Ratnapura'
  ]);

  // Popular Theatres in Sri Lanka
  const theatres = [
    'Savoy 3D Cinema - Colombo',
    'Majestic Cineplex - Colombo',
    'Liberty by Scope Cinemas - Colombo',
    'Empire Cinema - Kandy',
    'New Olympia - Galle',
    'Rex Cinema - Jaffna'
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      // CURRENTLY SHOWING IN SRI LANKA THEATRES
      const trending = [
        {
          id: 1,
          title: "பராசக்தி (Parasakthi)",
          genre: "Drama, Family",
          duration: "2h 35m",
          rating: "U",
          language: "Tamil",
          formats: ["2D"],
          imdb: 8.2,
          price: 1200,
          posterUrl: require('../assets/images/Para.jpeg'),
          description: "A classic Tamil drama film now re-released in theatres"
        },
        {
          id: 2,
          title: "Interstellar",
          genre: "Sci-Fi, Adventure",
          duration: "2h 49m",
          rating: "PG-13",
          language: "English",
          formats: ["IMAX", "2D"],
          imdb: 8.6,
          price: 1500,
          posterUrl: require('../assets/images/intersteller.jpeg'),
          description: "Re-release of Christopher Nolan's epic space exploration film"
        },
        {
          id: 3,
          title: "ගම්පෙරළිය (Gamperaliya)",
          genre: "Drama, Romance",
          duration: "2h 15m",
          rating: "U",
          language: "Sinhala",
          formats: ["2D"],
          imdb: 8.1,
          price: 1000,
          posterUrl: require('../assets/images/gam.jpeg'),
          description: "Classic Sinhala film based on Martin Wickramasinghe's novel"
        },
        {
          id: 4,
          title: "Dune: Part Two",
          genre: "Sci-Fi, Adventure",
          duration: "2h 46m",
          rating: "PG-13",
          language: "English",
          formats: ["IMAX", "3D"],
          imdb: 8.7,
          price: 1800,
          posterUrl: require('../assets/images/dune.jpeg'),
          description: "The epic continuation of the Dune saga"
        }
      ];

      // UPCOMING RELEASES IN SRI LANKA
      const upcoming = [
        {
          id: 5,
          title: "ஜனநாயகன் (Jana Nayagan)",
          genre: "Drama, Political",
          duration: "2h 30m",
          releaseDate: "15 May 2026",
          language: "Tamil",
          posterUrl: require('../assets/images/jana.jpeg'),
          description: "Upcoming Sinhala political drama film"
        },
        {
          id: 6,
          title: "Avatar 3",
          genre: "Sci-Fi, Adventure",
          duration: "3h 10m",
          releaseDate: "20 May 2026",
          language: "English",
          posterUrl: require('../assets/images/avatar3.jpeg'),
          description: "The next chapter in the Avatar saga"
        }
      ];

      setTrendingMovies(trending);
      setUpcomingMovies(upcoming);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageBadge = (language) => {
    switch (language) {
      case 'Sinhala': return 'lang-badge-sinhala';
      case 'Tamil': return 'lang-badge-tamil';
      case 'English': return 'lang-badge-english';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="fade-in">
      {/* Hero Section with Sri Lanka context */}
      <div className="bg-dark text-white rounded-0 mb-5">
        <div className="container">
          <div className="row align-items-center py-5">
            <div className="col-lg-8">
              <h1 className="display-5 fw-bold mb-3">Book Movie Tickets Across Sri Lanka</h1>
              <p className="lead mb-4 opacity-90">
                From Colombo to Jaffna, experience the best of cinema in theatres nationwide.
                Secure your seats instantly with our reliable booking platform.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link
                  to="/shows"
                  className="btn btn-primary btn-lg px-5"
                >
                  <i className="bi bi-ticket-perforated me-2"></i>
                  Book Tickets Now
                </Link>
                {!user && (
                  <Link
                    to="/signup"
                    className="btn btn-outline-light btn-lg px-5"
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Create Account
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-4 text-center mt-4 mt-lg-0">
              <div className="bg-gradient-sri rounded-3 p-4 d-inline-block">
                <h4 className="fw-bold mb-2">Now Showing</h4>
                <p className="mb-0">Across 50+ theatres in Sri Lanka</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* City Selection - Sri Lanka Cities */}
      <div className="container py-4">
        <h2 className="fw-bold mb-4">
          <i className="bi bi-geo-alt me-2"></i>
          Select Your City
        </h2>
        <div className="row g-2">
          {cities.map((city, index) => (
            <div key={index} className="col-4 col-sm-3 col-md-2 col-lg-2">
              <button className="btn btn-outline-secondary w-100 py-2">
                {city}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Theatres */}
      <div className="container py-4">
        <h2 className="fw-bold mb-3">
          <i className="bi bi-building me-2"></i>
          Popular Theatres
        </h2>
        <div className="row g-3">
          {theatres.map((theatre, index) => (
            <div key={index} className="col-md-4 col-lg-2">
              <div className="card text-center p-3">
                <i className="bi bi-camera-reels text-primary fs-4 mb-2"></i>
                <small className="theatre-name">{theatre}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Currently Showing Movies */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            <i className="bi bi-fire me-2"></i>
            Currently Showing in Theatres
          </h2>
          <Link to="/shows" className="text-primary fw-medium text-decoration-none">
            View All <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="row">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-md-3">
                <div className="movie-card">
                  <div className="placeholder-glow">
                    <div className="placeholder" style={{ height: '300px' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-4">
            {trendingMovies.map((movie) => (
              <div key={movie.id} className="col-md-6 col-lg-3">
                <div className="movie-card">
                  <div className="position-relative">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="img-fluid w-100"
                      style={{ height: '280px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className={`badge ${getLanguageBadge(movie.language)}`}>
                        {movie.language}
                      </span>
                    </div>
                    <div className="position-absolute bottom-0 start-0 m-2">
                      <span className="badge bg-warning text-dark">
                        <i className="bi bi-star-fill me-1"></i>
                        {movie.imdb}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h5 className="fw-bold mb-2">{movie.title}</h5>
                    <div className="d-flex justify-content-between text-muted small mb-2">
                      <span>{movie.genre}</span>
                      <span>{movie.duration}</span>
                    </div>
                    <p className="text-muted small mb-3">{movie.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="price-tag">Rs. {movie.price}</span>
                      <Link
                        to={`/shows/${movie.id}/seats`}
                        className="btn btn-primary btn-sm"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Movies */}
      <div className="container py-5">
        <h2 className="fw-bold mb-4">
          <i className="bi bi-calendar2-plus me-2"></i>
          Coming Soon to Sri Lanka Theatres
        </h2>
        <div className="row g-4">
          {upcomingMovies.map((movie) => (
            <div key={movie.id} className="col-md-6">
              <div className="d-flex bg-light rounded-3 p-3 align-items-center">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="img-fluid rounded"
                  style={{ width: '120px', height: '160px', objectFit: 'cover' }}
                />
                <div className="ms-4 flex-grow-1">
                  <h5 className="fw-bold">{movie.title}</h5>
                  <p className="text-muted mb-2">{movie.genre}</p>
                  <div className="d-flex align-items-center mb-2">
                    <span className={`badge ${getLanguageBadge(movie.language)} me-2`}>
                      {movie.language}
                    </span>
                    <i className="bi bi-calendar3 me-2 text-primary"></i>
                    <span className="fw-medium">{movie.releaseDate}</span>
                  </div>
                  <p className="text-muted small mb-3">{movie.description}</p>
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-bell me-1"></i>
                    Notify When Available
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sri Lanka Cinema Statistics */}
      <div className="bg-light py-5">
        <div className="container">
          <h3 className="fw-bold text-center mb-4">Cinema in Sri Lanka</h3>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="text-center p-3">
                <div className="display-6 fw-bold text-primary mb-2">50+</div>
                <p className="text-muted mb-0">Theatres Nationwide</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center p-3">
                <div className="display-6 fw-bold text-primary mb-2">3</div>
                <p className="text-muted mb-0">Languages Supported</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center p-3">
                <div className="display-6 fw-bold text-primary mb-2">1M+</div>
                <p className="text-muted mb-0">Tickets Booked Monthly</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center p-3">
                <div className="display-6 fw-bold text-primary mb-2">24/7</div>
                <p className="text-muted mb-0">Booking Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;