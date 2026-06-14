import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: 8 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onLoginSuccess(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google mock login
    const mockUser = { email: 'karan@gmail.com', name: 'Karan Yadav' };
    onLoginSuccess(mockUser, 'mock-jwt-token-google-12345');
    navigate('/');
  };

  return (
    <div className="auth-container">
      {/* Top Header Card Icon */}
      <div className="auth-header-icon">
        <LogIn size={22} />
      </div>

      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Log in to your account</p>

      {/* Main Form Card */}
      <div className="auth-card">
        <button 
          type="button" 
          className="google-btn"
          onClick={handleGoogleLogin}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="or-divider">OR</div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="email">Email</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={16} />
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="password">Password</label>
              <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
            </div>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={16} />
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {error && <div className="auth-error-msg">{error}</div>}
      </div>

      {/* Footer Text */}
      <div className="auth-footer">
        Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
      </div>
    </div>
  );
}
