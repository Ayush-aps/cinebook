import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const Shows = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2026-05-16');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCity, setSelectedCity] = useState('Colombo');

  // Sri Lanka specific
  const cities = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Matara'];
  const languages = ['all', 'Sinhala', 'Tamil', 'English'];
  const formats = ['2D', '3D', 'IMAX'];

  // Sri Lanka Theatres by City
  const theatresByCity = {
    'Colombo': ['Savoy 3D Cinema', 'Majestic Cineplex', 'Liberty Cinema', 'Empire Cinema'],
    'Kandy': ['Kandy Cineplex', 'New Olympia', 'Regal Cinema'],
    'Galle': ['Galle Cinema', 'Ruhunu Cinema'],
    'Jaffna': ['Rex Cinema', 'New York Cinema'],
    'Negombo': ['Negombo Cineplex'],
    'Matara': ['Matara Cinema Hall']
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const mockMovies = [
        {
          id: 1,
          title: "பராசக்தி (Parasakthi)",
          description: "Classic Tamil drama film now re-released in Sri Lankan theatres. A story of family, tradition, and societal change.",
          duration: "2h 35m",
          rating: "U",
          genre: "Drama, Family",
          language: "Tamil",
          formats: ["2D"],
          imdb: 8.2,
          posterUrl: require('../assets/images/Para.jpeg'),
          showtimes: [
            { time: "10:30 AM", format: "2D", price: 1000, theatre: "Savoy 3D Cinema" },
            { time: "02:00 PM", format: "2D", price: 1200, theatre: "Majestic Cineplex" },
            { time: "06:30 PM", format: "2D", price: 1200, theatre: "Liberty Cinema" },
            { time: "11:45 PM", format: "2D", price: 1200, theatre: "Empire Cinema" }
          ]
        },
        {
          id: 2,
          title: "Interstellar",
          description: "Christopher Nolan's epic space exploration film re-released in IMAX. Experience the journey through wormholes in stunning quality.",
          duration: "2h 49m",
          rating: "PG-13",
          genre: "Sci-Fi, Adventure",
          language: "English",
          formats: ["IMAX", "2D"],
          imdb: 8.6,
          posterUrl: require('../assets/images/intersteller.jpeg'),
          showtimes: [
            { time: "11:00 AM", format: "2D", price: 1200, theatre: "Savoy 3D Cinema" },
            { time: "03:30 PM", format: "IMAX", price: 1800, theatre: "Majestic Cineplex" },
            { time: "07:15 PM", format: "IMAX", price: 1800, theatre: "Liberty Cinema" },
            { time: "10:30 PM", format: "2D", price: 1500, theatre: "Empire Cinema" }
          ]
        },
        {
          id: 3,
          title: "ගම්පෙරළිය (Gamperaliya)",
          description: "Classic Sinhala film based on Martin Wickramasinghe's novel. A tale of changing social structures in rural Sri Lanka.",
          duration: "2h 15m",
          rating: "U",
          genre: "Drama, Romance",
          language: "Sinhala",
          formats: ["2D"],
          imdb: 8.1,
          posterUrl: require('../assets/images/gam.jpeg'),
          showtimes: [
            { time: "10:00 AM", format: "2D", price: 800, theatre: "Kandy Cineplex" },
            { time: "01:45 PM", format: "2D", price: 800, theatre: "Galle Cinema" },
            { time: "05:30 PM", format: "2D", price: 1000, theatre: "Rex Cinema" },
            { time: "08:45 PM", format: "2D", price: 1000, theatre: "Negombo Cineplex" }
          ]
        },
        {
          id: 4,
          title: "Dune: Part Two",
          description: "The epic continuation of the Dune saga. Paul Atreides unites with the Fremen on a path of revenge and destiny.",
          duration: "2h 46m",
          rating: "PG-13",
          genre: "Sci-Fi, Adventure",
          language: "English",
          formats: ["IMAX", "3D", "2D"],
          imdb: 8.7,
          posterUrl: require('../assets/images/dune.jpeg'),
          showtimes: [
            { time: "12:15 PM", format: "3D", price: 1600, theatre: "Savoy 3D Cinema" },
            { time: "04:00 PM", format: "IMAX", price: 2000, theatre: "Majestic Cineplex" },
            { time: "08:30 PM", format: "IMAX", price: 2000, theatre: "Liberty Cinema" },
            { time: "11:15 PM", format: "3D", price: 1600, theatre: "Empire Cinema" }
          ]
        }
      ];

      setMovies(mockMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  // client/src/pages/Shows.jsx - Update the handleBookNow function
  const handleBookNow = (movie, showtime) => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Pass all necessary data via URL params or state
    // For testing: ensuring date is always in the future relative to now
    navigate(`/shows/${movie.id}/seats`, {
      state: {
        movieId: movie.id,
        movieTitle: movie.title,
        theatre: showtime.theatre,
        date: selectedDate, // The validation in seatSelection is commented out, so this should be fine
        time: showtime.time,
        format: showtime.format,
        price: showtime.price,
        city: selectedCity
      }
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
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
    <div className="container py-4 fade-in">
      {/* Header with Sri Lanka context */}
      <div className="mb-5">
        <div className="d-flex align-items-center mb-3">
          <h1 className="fw-bold mb-0">
            <i className="bi bi-camera-reels me-2"></i>
            Movies in {selectedCity}
          </h1>
          <span className="city-badge ms-3">Sri Lanka</span>
        </div>

        {/* Filters */}
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label fw-medium">City</label>
            <select
              className="form-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-medium">Date</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-medium">Language</label>
            <select
              className="form-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang === 'all' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-medium">Theatre</label>
            <select className="form-select">
              <option>All Theatres</option>
              {(theatresByCity[selectedCity] || []).map(theatre => (
                <option key={theatre}>{theatre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Movies List */}
      {loading ? (
        <div className="row">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="col-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="placeholder-glow">
                    <div className="placeholder col-12" style={{ height: '200px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="row">
          {movies.map((movie) => (
            <div key={movie.id} className="col-12 mb-4">
              <div className="card movie-card">
                <div className="row g-0">
                  <div className="col-md-3">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="img-fluid h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div className="col-md-9">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h4 className="card-title fw-bold">{movie.title}</h4>
                          <div className="d-flex align-items-center mb-2">
                            <span className={`badge ${getLanguageBadge(movie.language)} me-2`}>
                              {movie.language}
                            </span>
                            <span className="badge bg-primary me-2">{movie.rating}</span>
                            <span className="text-muted me-3">
                              <i className="bi bi-clock me-1"></i>
                              {movie.duration}
                            </span>
                            <span className="text-muted">
                              <i className="bi bi-star-fill text-warning me-1"></i>
                              {movie.imdb}/10
                            </span>
                          </div>
                          <p className="text-muted mb-3">{movie.description}</p>
                          <div className="mb-3">
                            {movie.formats.map((format, idx) => (
                              <span key={idx} className="badge bg-light text-dark border me-2">
                                {format}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="text-primary fw-bold">From Rs. {Math.min(...movie.showtimes.map(s => s.price))}</div>
                          <small className="text-muted">per ticket</small>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h6 className="fw-bold mb-3">
                          Showtimes in {selectedCity} - {formatDate(selectedDate)}
                        </h6>
                        <div className="row g-2">
                          {movie.showtimes.map((showtime, idx) => (
                            <div key={idx} className="col-6 col-sm-4 col-md-3">
                              <button
                                onClick={() => handleBookNow(movie, showtime)}
                                className="btn btn-outline-primary w-100 py-2 text-start"
                              >
                                <div className="fw-bold">{showtime.time}</div>
                                <div className="small text-muted">{showtime.theatre}</div>
                                <div className="small">
                                  {showtime.format} • <span className="price-tag">Rs. {showtime.price}</span>
                                </div>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sri Lanka Cinema Info */}
      <div className="mt-5">
        <div className="alert alert-info">
          <h6 className="fw-bold">
            <i className="bi bi-info-circle me-2"></i>
            About Cinema in Sri Lanka
          </h6>
          <p className="mb-0 small">
            Sri Lankan cinema features films in Sinhala, Tamil, and English.
            Major theatre chains operate in Colombo, Kandy, Galle, and Jaffna.
            Ticket prices typically range from Rs. 800 to Rs. 2000 depending on format and location.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shows;