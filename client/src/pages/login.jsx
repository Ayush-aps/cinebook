import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        // REAL API CALL to auth-service
        const result = await login(formData.email, formData.password, formData.role);
        
        toast.success('Login successful!');
        
        // Redirect based on role
        if (formData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/shows');
        }
      } catch (error) {
        // Error is already shown by axios interceptor
        console.error('Login error:', error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="text-center mb-5">
            <h1 className="fw-bold text-primary mb-2">
              <i className="bi bi-camera-reels me-2"></i>
              CineBook
            </h1>
            <p className="text-muted">Distributed Movie Booking System</p>
          </div>

          <div className="card shadow-lg">
            <div className="card-body p-5">
              <h3 className="card-title text-center mb-4">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Sign In
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold">Login As</label>
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'customer' })}
                      className={`btn ${formData.role === 'customer' ? 'btn-primary' : 'btn-outline-primary'}`}
                    >
                      <i className="bi bi-person me-2"></i>
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'admin' })}
                      className={`btn ${formData.role === 'admin' ? 'btn-primary' : 'btn-outline-primary'}`}
                    >
                      <i className="bi bi-shield-check me-2"></i>
                      Administrator
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="bi bi-envelope me-1"></i>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-control form-control-lg"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    <i className="bi bi-key me-1"></i>
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="form-control form-control-lg"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="btn btn-outline-secondary"
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg w-100 py-3"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary fw-bold">
                    Sign Up
                  </Link>
                </p>
                <p className="text-muted small mt-2">
                  <i className="bi bi-cpu me-1"></i>
                  Distributed system authentication across multiple instances
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;