import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role
      });

      toast.success('Account created successfully!');

      if (formData.role === 'admin') navigate('/admin');
      else navigate('/shows');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
      console.error('Signup error:', error);
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
                <i className="bi bi-person-plus me-2"></i>
                Create Account
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="form-control form-control-lg"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    placeholder="you@gmail.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="form-control form-control-lg"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Phone</label>
                  <input
                    type="tel"
                    placeholder="0123456789"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="form-control form-control-lg"
                  />
                </div>

                <div className="mb-3">
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
                  <label className="form-label fw-bold">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="form-control form-control-lg"
                  />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-100 py-3">
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Create Account
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-bold">
                    Sign In
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

export default Signup;
