import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <h1>Support Ticket CRM</h1>
        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/new" className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            New Ticket
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
