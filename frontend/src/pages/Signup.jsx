import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import api from '../api/axios';
import './Auth.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><Home size={24} /></div>
          <div className="auth-logo-text">ChoreAid</div>
        </div>

        <div className="auth-tabs">
          <Link to="/login" className="auth-tab">Login</Link>
          <div className="auth-tab active">Sign Up</div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="field-group">
            <label>Email address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="field-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="field-group">
            <label>I am a</label>
            <div className="role-toggle">
              <div
                className={`role-option ${role === 'customer' ? 'active' : ''}`}
                onClick={() => setRole('customer')}
              >
                Customer
              </div>
              <div
                className={`role-option ${role === 'provider' ? 'active' : ''}`}
                onClick={() => setRole('provider')}
              >
                Provider
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary">Sign Up</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;