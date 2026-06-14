import { useState, useEffect } from 'react';
import { getTickets } from '../api/tickets';
import TicketsTable from '../components/TicketsTable';
import { Search, Filter, Ticket, CircleDot, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getTickets();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute stats based on the full list of tickets
  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const progressCount = tickets.filter(t => t.status === 'In Progress').length;
  const closedCount = tickets.filter(t => t.status === 'Closed').length;

  // Filter tickets for the table list
  const filteredTickets = tickets.filter(t => {
    const matchesStatus = status ? t.status === status : true;
    const matchesSearch = search ? (
      t.ticket_id.toLowerCase().includes(search.toLowerCase()) ||
      t.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      (t.customer_email && t.customer_email.toLowerCase().includes(search.toLowerCase())) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
    ) : true;
    return matchesStatus && matchesSearch;
  });

  return (
    <section className="page-container">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-info">
            <span className="stat-label">Total Tickets</span>
            <span className="stat-value">{totalCount}</span>
          </div>
          <div className="stat-icon-wrapper">
            <Ticket size={22} />
          </div>
        </div>

        <div className="stat-card stat-open">
          <div className="stat-info">
            <span className="stat-label">Open</span>
            <span className="stat-value">{openCount}</span>
          </div>
          <div className="stat-icon-wrapper">
            <CircleDot size={22} />
          </div>
        </div>

        <div className="stat-card stat-progress">
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{progressCount}</span>
          </div>
          <div className="stat-icon-wrapper">
            <Clock size={22} />
          </div>
        </div>

        <div className="stat-card stat-closed">
          <div className="stat-info">
            <span className="stat-label">Closed</span>
            <span className="stat-value">{closedCount}</span>
          </div>
          <div className="stat-icon-wrapper">
            <CheckCircle size={22} />
          </div>
        </div>
      </div>

      {/* Toolbar Search & Filter */}
      <div className="toolbar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search tickets by ID, name, email, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-select-wrapper">
          <Filter className="filter-icon" size={16} />
          <select 
            className="filter-select"
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-msg">{error}</div>}

      {/* Tickets Table */}
      {!error && (
        <TicketsTable tickets={filteredTickets} loading={loading} />
      )}
    </section>
  );
}
