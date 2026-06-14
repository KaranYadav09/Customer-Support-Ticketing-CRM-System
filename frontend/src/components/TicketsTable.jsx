import { useNavigate } from 'react-router-dom';
import { Eye, Edit2 } from 'lucide-react';
import { formatDate } from '../utils';

export default function TicketsTable({ tickets, loading }) {
  const navigate = useNavigate();

  const getStatusClass = (status) => {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-inprogress';
      case 'Closed': return 'status-closed';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-state-text">Loading tickets...</div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-text">No tickets found.</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="tickets-table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Customer</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.ticket_id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/tickets/${t.ticket_id}`)}>
              <td>
                <span className="ticket-id-link">
                  {t.ticket_id}
                </span>
              </td>
              <td>
                <div className="customer-cell">
                  <span className="customer-name">{t.customer_name}</span>
                  <span className="customer-email">{t.customer_email}</span>
                </div>
              </td>
              <td>
                <span className="ticket-subject">{t.subject}</span>
              </td>
              <td>
                <span className={`status-badge ${getStatusClass(t.status)}`}>
                  {t.status}
                </span>
              </td>
              <td>
                <span className={`priority-badge ${getPriorityClass(t.priority)}`}>
                  {t.priority || 'Medium'}
                </span>
              </td>
              <td>
                {formatDate(t.created_at)}
              </td>
              <td>
                <div className="actions-cell" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="action-btn" 
                    title="View Ticket"
                    onClick={() => navigate(`/tickets/${t.ticket_id}`)}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className="action-btn" 
                    title="Edit Ticket"
                    onClick={() => navigate(`/tickets/${t.ticket_id}`)}
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
