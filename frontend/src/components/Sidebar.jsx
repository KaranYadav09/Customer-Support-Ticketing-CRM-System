import { NavLink } from 'react-router-dom';
import { Headphones, LayoutDashboard, Ticket, Plus } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile drawer backdrop */}
      <div
        className={`sidebar-overlay ${isOpen ? 'mobile-open' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div>
          {/* Logo */}
          <div className="sidebar-logo">
            <span className="sidebar-logo-text">SupportCRM</span>
          </div>

          {/* Navigation Links */}
          <nav className="sidebar-nav">
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              end
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/tickets"
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Ticket size={18} />
              <span>All Tickets</span>
            </NavLink>

            <NavLink
              to="/new"
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Plus size={18} />
              <span>Create Ticket</span>
            </NavLink>
          </nav>
        </div>

      </aside>
    </>
  );
}
