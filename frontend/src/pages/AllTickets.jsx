import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../api/tickets';
import TicketsTable from '../components/TicketsTable';
import { Search, Filter, Plus } from 'lucide-react';

export default function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  
  const navigate = useNavigate();

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
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1 className="page-title">All Tickets</h1>
          <span className="page-subtitle">{tickets.length} total tickets</span>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/new')}
        >
          <Plus size={16} />
          <span>New Ticket</span>
        </button>
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
