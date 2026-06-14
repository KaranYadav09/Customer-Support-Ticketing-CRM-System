import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AllTickets from './pages/AllTickets';
import NewTicket from './pages/NewTicket';
import TicketDetail from './pages/TicketDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import InvalidResetLink from './pages/InvalidResetLink';
import { Menu, Bell } from 'lucide-react';
import './App.css';


function saveSession(user, token) {
  localStorage.setItem('crm_user', JSON.stringify(user));
  localStorage.setItem('crm_token', token);
}

function loadSession() {
  try {
    const user = JSON.parse(localStorage.getItem('crm_user'));
    const token = localStorage.getItem('crm_token');
    return user && token ? { user, token } : null;
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem('crm_user');
  localStorage.removeItem('crm_token');
}

// Protected Route wrapper
function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Auth Route wrapper 
function AuthRoute({ isAuthenticated, children }) {
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

// Main App Shell (sidebar + header + routes)
function AppShell({ user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/tickets') return 'All Tickets';
    if (path === '/new') return 'Create Ticket';
    if (path.startsWith('/tickets/')) return 'Ticket Detail';
    return 'SupportCRM';
  };

  // Derive initials from user name
  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              className="hamburger-toggle"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open Sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="topbar-title">{getPageTitle()}</h1>
          </div>

          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications">
              <Bell size={18} />
              <span className="badge-dot"></span>
            </button>

            <div className="profile-dropdown-wrapper">
              <div
                className="user-profile"
                onClick={() => setProfileOpen((o) => !o)}
                title="Account menu"
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div className="avatar">{getInitials(user?.name)}</div>
                <span className="username">{user?.name || 'User'}</span>
              </div>

              {profileOpen && (
                <>
                  {/* Click-outside backdrop */}
                  <div
                    className="profile-backdrop"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-email">
                      {user?.email || ''}
                    </div>
                    <div className="profile-dropdown-divider" />
                    <button
                      className="profile-dropdown-signout"
                      onClick={() => { setProfileOpen(false); onLogout(); }}
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets" element={<AllTickets />} />
          <Route path="/new" element={<NewTicket />} />
          <Route path="/tickets/:ticketId" element={<TicketDetail />} />
        </Routes>
      </main>
    </div>
  );
}

// ---- Root App ----
export default function App() {
  const [session, setSession] = useState(() => loadSession());

  const handleLoginSuccess = (user, token) => {
    saveSession(user, token);
    setSession({ user, token });
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
  };

  const isAuthenticated = !!session;

  return (
    <Routes>

      <Route
        path="/login"
        element={
          <AuthRoute isAuthenticated={isAuthenticated}>
            <Login onLoginSuccess={handleLoginSuccess} />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute isAuthenticated={isAuthenticated}>
            <Register onLoginSuccess={handleLoginSuccess} />
          </AuthRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/invalid-reset-link" element={<InvalidResetLink />} />

      {/* Protected app routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell user={session?.user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
