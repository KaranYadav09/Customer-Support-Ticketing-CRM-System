import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: 8 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export default function Register({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    // Derive name from email (e.g. karan@gmail.com -> Karan)
    const emailName = email.split('@')[0];
    const derivedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: derivedName }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const mockUser = { email: 'karan@gmail.com', name: 'Karan Yadav' };
    onLoginSuccess(mockUser, 'mock-jwt-token-google-12345');
    navigate('/');
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title" style={{ marginTop: 24 }}>Create your account</h1>
      <p className="auth-subtitle">Sign up to get started</p>

      {/* Main Card */}
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

        <form onSubmit={handleRegister} className="auth-form">
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
            <label className="auth-label" htmlFor="password">Password</label>
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

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={16} />
              <input
                id="confirmPassword"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {error && <div className="auth-error-msg">{error}</div>}
        {success && <div className="auth-error-msg" style={{ backgroundColor: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}>{success}</div>}
      </div>

      {/* Footer link */}
      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Log in</Link>
      </div>
    </div>
  );
}
