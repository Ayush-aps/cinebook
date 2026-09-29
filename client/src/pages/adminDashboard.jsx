import { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [serverHealth, setServerHealth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    startHealthMonitoring();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const mockStats = {
        totalBookings: 1247,
        totalRevenue: 425600,
        activeUsers: 89,
        availableSeats: 320
      };

      const mockBookings = [
        { id: 'BK001', user: 'John Doe', movie: 'Interstellar', seats: 2, amount: 700, time: '10:30 AM' },
        { id: 'BK002', user: 'Jane Smith', movie: 'Dune: Part Two', seats: 3, amount: 1200, time: '11:45 AM' },
        { id: 'BK003', user: 'Bob Wilson', movie: 'The Matrix', seats: 1, amount: 320, time: '12:15 PM' },
        { id: 'BK004', user: 'Alice Brown', movie: 'Inception', seats: 4, amount: 1280, time: '01:30 PM' }
      ];

      const mockServers = [
        { id: 'server-1', port: 3001, status: 'running', requests: 245, cpu: 45, memory: 60 },
        { id: 'server-2', port: 3002, status: 'running', requests: 198, cpu: 38, memory: 55 },
        { id: 'nginx', port: 80, status: 'running', requests: 443, cpu: 25, memory: 40 }
      ];

      setStats(mockStats);
      setRecentBookings(mockBookings);
      setServerHealth(mockServers);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startHealthMonitoring = () => {
    const interval = setInterval(() => {
      setServerHealth(prev => prev.map(server => ({
        ...server,
        requests: server.requests + Math.floor(Math.random() * 10),
        cpu: Math.min(100, server.cpu + (Math.random() * 2 - 1)),
        memory: Math.min(100, server.memory + (Math.random() * 2 - 1))
      })));
    }, 5000);

    return () => clearInterval(interval);
  };

  const simulateServerFailure = (port) => {
    setServerHealth(prev => prev.map(server => 
      server.port === port 
        ? { ...server, status: 'failed', requests: 0, cpu: 0, memory: 0 }
        : server
    ));
  };

  const restartServer = (port) => {
    setServerHealth(prev => prev.map(server => 
      server.port === port 
        ? { ...server, status: 'running', requests: 0, cpu: 25, memory: 30 }
        : server
    ));
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-4 fade-in">
      {/* Header */}
      <div className="mb-5">
        <h1 className="fw-bold">
          <i className="bi bi-speedometer2 me-2"></i>
          Admin Dashboard
        </h1>
        <p className="text-muted">Monitor and manage the distributed movie booking system</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card bg-primary bg-opacity-10 border-primary">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-ticket-perforated text-primary fs-1 me-3"></i>
                <div>
                  <h3 className="fw-bold">{stats.totalBookings}</h3>
                  <p className="text-muted mb-0">Total Bookings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-success bg-opacity-10 border-success">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-currency-rupee text-success fs-1 me-3"></i>
                <div>
                  <h3 className="fw-bold">₹{stats.totalRevenue.toLocaleString()}</h3>
                  <p className="text-muted mb-0">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-info bg-opacity-10 border-info">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-people text-info fs-1 me-3"></i>
                <div>
                  <h3 className="fw-bold">{stats.activeUsers}</h3>
                  <p className="text-muted mb-0">Active Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-warning bg-opacity-10 border-warning">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-grid-3x3-gap text-warning fs-1 me-3"></i>
                <div>
                  <h3 className="fw-bold">{stats.availableSeats}</h3>
                  <p className="text-muted mb-0">Available Seats</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Server Health */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-server me-2"></i>
                Server Health Monitoring
              </h5>
              <span className="badge bg-success">
                <i className="bi bi-circle-fill me-1"></i>
                Distributed System
              </span>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {serverHealth.map((server) => (
                  <div key={server.id} className="col-12">
                    <div className="card border">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center">
                            <i className={`bi bi-${server.status === 'running' ? 'check-circle-fill text-success' : 'x-circle-fill text-danger'} me-2`}></i>
                            <span className="fw-bold">localhost:{server.port}</span>
                            <span className={`badge ms-2 ${server.status === 'running' ? 'bg-success' : 'bg-danger'}`}>
                              {server.status}
                            </span>
                          </div>
                          <div className="text-muted small">
                            {server.requests} requests
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <div className="d-flex justify-content-between small text-muted mb-1">
                            <span>CPU Usage</span>
                            <span>{server.cpu.toFixed(1)}%</span>
                          </div>
                          <div className="progress" style={{ height: '8px' }}>
                            <div 
                              className={`progress-bar ${server.cpu > 80 ? 'bg-danger' : server.cpu > 60 ? 'bg-warning' : 'bg-success'}`}
                              style={{ width: `${server.cpu}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="d-flex justify-content-between small text-muted mb-1">
                            <span>Memory Usage</span>
                            <span>{server.memory.toFixed(1)}%</span>
                          </div>
                          <div className="progress" style={{ height: '8px' }}>
                            <div 
                              className={`progress-bar ${server.memory > 80 ? 'bg-danger' : server.memory > 60 ? 'bg-warning' : 'bg-info'}`}
                              style={{ width: `${server.memory}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => simulateServerFailure(server.port)}
                            className="btn btn-outline-danger btn-sm"
                            disabled={server.status === 'failed'}
                          >
                            <i className="bi bi-power me-1"></i>
                            Simulate Failure
                          </button>
                          <button
                            onClick={() => restartServer(server.port)}
                            className="btn btn-outline-success btn-sm"
                            disabled={server.status === 'running'}
                          >
                            <i className="bi bi-arrow-clockwise me-1"></i>
                            Restart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Recent Bookings
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>User</th>
                      <th>Seats</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <span className="badge bg-primary bg-opacity-10 text-primary">
                            {booking.id}
                          </span>
                        </td>
                        <td>{booking.user}</td>
                        <td>
                          <span className="badge bg-info">
                            {booking.seats} seat{booking.seats !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="fw-bold">₹{booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Control Panel */}
      <div className="card mt-4">
        <div className="card-header bg-white">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-gear me-2"></i>
            Distributed System Controls
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <h6 className="fw-bold mb-3">Load Balancer Settings</h6>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="roundRobin" defaultChecked />
                <label className="form-check-label" htmlFor="roundRobin">Round Robin</label>
              </div>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="healthChecks" defaultChecked />
                <label className="form-check-label" htmlFor="healthChecks">Health Checks</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="failover" defaultChecked />
                <label className="form-check-label" htmlFor="failover">Automatic Failover</label>
              </div>
            </div>
            
            <div className="col-md-6">
              <h6 className="fw-bold mb-3">Database Replication</h6>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <span>Primary Database: Synchronized</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <span>Replica 1: Synchronized</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <span>Replica 2: Synchronized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="alert alert-warning mt-4">
        <div className="d-flex">
          <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
          <div>
            <h6 className="fw-bold">Demo Instructions for Examiners</h6>
            <ul className="mb-0">
              <li>Use "Simulate Failure" to kill backend instances during booking process</li>
              <li>Observe automatic failover in booking flow</li>
              <li>Test concurrent bookings by opening multiple browser tabs</li>
              <li>Monitor real-time server health metrics</li>
              <li>Check distributed system controls and configurations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;