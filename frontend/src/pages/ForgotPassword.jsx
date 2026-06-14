import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending reset link (mock) 
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="auth-container">
      {/* Top Header Icon */}
      <div className="auth-header-icon">
        <Mail size={22} />
      </div>

      <h1 className="auth-title">Reset password</h1>
      <p className="auth-subtitle">We'll send you a link to reset it</p>

      {/* Main Card */}
      <div className="auth-card">
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div
              style={{
                width: 56,
                height: 56,
                background: '#f0fdf4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Mail size={24} color="#16a34a" />
            </div>
            <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Check your inbox</p>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="email">Email address</label>
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

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}
      </div>

      {/* Footer link */}
      <div className="auth-footer">
        <Link to="/login" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={14} />
          Back to log in
        </Link>
      </div>
    </div>
  );
}
