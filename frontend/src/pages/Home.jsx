import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../api/tickets';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils';

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadTickets = useCallback(async (searchVal, statusVal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTickets({ search: searchVal, status: statusVal });
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    loadTickets('', '');
  }, [loadTickets]);

  // status reload
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadTickets(search, status);
    }, 250);
    return () => clearTimeout(timeout);
  }, [search, status, loadTickets]);

  return (
    <section className="view active">
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by name, ID, email, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="ticket-table-wrapper">
        {error && <div className="error-msg">{error}</div>}

        {!error && (
          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Customer</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.ticket_id} onClick={() => navigate(`/tickets/${t.ticket_id}`)}>
                  <td>{t.ticket_id}</td>
                  <td>{t.customer_name}</td>
                  <td>{t.subject}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>{formatDate(t.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!error && !loading && tickets.length === 0 && (
          <div className="empty-state">No tickets found.</div>
        )}

        {loading && <div className="empty-state">Loading...</div>}
      </div>
    </section>
  );
}
