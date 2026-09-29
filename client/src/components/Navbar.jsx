import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="fw-bold" style={{ fontSize: '26px', color: '#e74c3c' }}>CineBook</span>
          <span className="city-badge ms-2">Sri Lanka</span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item mx-2">
              <Link className="nav-link fw-medium" to="/">
                <i className="bi bi-house-door me-1"></i>
                Home
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link fw-medium" to="/shows">
                <i className="bi bi-film me-1"></i>
                Movies
              </Link>
            </li>
            <li className="nav-item mx-2">
              <a className="nav-link fw-medium" href="#">
                <i className="bi bi-calendar3 me-1"></i>
                Coming Soon
              </a>
            </li>
            <li className="nav-item mx-2">
              <a className="nav-link fw-medium" href="#">
                <i className="bi bi-ticket-perforated me-1"></i>
                Offers
              </a>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn btn-outline-primary btn-sm me-3">
                    <i className="bi bi-speedometer2 me-1"></i>
                    Admin
                  </Link>
                )}
                <div className="dropdown">
                  <button 
                    className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center" 
                    type="button" 
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    {user.name}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/bookings">
                        <i className="bi bi-receipt me-2"></i>
                        My Bookings
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/signup" className="btn btn-outline-primary">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-primary">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;