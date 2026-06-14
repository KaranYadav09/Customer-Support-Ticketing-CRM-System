import { Link } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';

export default function InvalidResetLink() {
  return (
    <div className="auth-container">
      {/* Top Header Icon */}
      <div className="auth-header-icon" style={{ background: '#2563eb' }}>
        <TriangleAlert size={22} />
      </div>

      <h1 className="auth-title">Invalid reset link</h1>
      <p className="auth-subtitle">This password reset link is missing or invalid</p>

      {/* Main Card */}
      <div className="auth-card" style={{ textAlign: 'center', padding: '28px 36px' }}>
        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
          The link you used appears to be incomplete. Please request a new password reset email.
        </p>
      </div>

      {/* Footer link */}
      <div className="auth-footer">
        <Link to="/forgot-password" className="auth-link">
          Request a new link
        </Link>
      </div>
    </div>
  );
}
