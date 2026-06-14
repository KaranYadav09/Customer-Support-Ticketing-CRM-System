import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicket, updateTicket } from '../api/tickets';
import { formatDate } from '../utils';
import { ArrowLeft, Send, Clock, User, Mail, Calendar } from 'lucide-react';

export default function TicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusValue, setStatusValue] = useState('Open');
  const [priorityValue, setPriorityValue] = useState('Medium');
  const [noteValue, setNoteValue] = useState('');
  const [updateResult, setUpdateResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadTicket = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTicket(ticketId);
      setTicket(data);
      setStatusValue(data.status);
      setPriorityValue(data.priority || 'Medium');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  async function handleSave() {
    if (!statusValue && !priorityValue && !noteValue.trim()) return;
    
    setSaving(true);
    setUpdateResult(null);
    try {
      await updateTicket(ticketId, { 
        status: statusValue, 
        priority: priorityValue, 
        notes: noteValue.trim() 
      });
      setUpdateResult({ type: 'success', message: 'Ticket updated successfully!' });
      setNoteValue('');
      await loadTicket();
    } catch (err) {
      setUpdateResult({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  }

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

  return (
    <section className="page-container">
      <div className="detail-top-nav">
        <button className="back-btn" onClick={() => navigate('/tickets')}>
          <ArrowLeft size={16} />
          <span>Back to all tickets</span>
        </button>
      </div>

      {loading && (
        <div className="empty-state">
          <div className="empty-state-text">Loading ticket details...</div>
        </div>
      )}
      
      {error && (
        <div className="card">
          <div className="error-msg">{error}</div>
        </div>
      )}

      {ticket && !loading && !error && (
        <div className="card detail-card">
          {/* Header Block */}
          <div className="detail-header-block">
            <div className="detail-header-text">
              <h2>{ticket.ticket_id} &mdash; {ticket.subject}</h2>
              <div className="detail-header-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={14} /> 
                  <strong>{ticket.customer_name}</strong> 
                  <span style={{ color: '#cbd5e1' }}>|</span> 
                  <Mail size={14} style={{ display: 'inline' }} /> {ticket.customer_email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Calendar size={14} />
                  Created: {formatDate(ticket.created_at)} 
                  <span style={{ color: '#cbd5e1' }}>|</span> 
                  Updated: {formatDate(ticket.updated_at)}
                </span>
              </div>
            </div>
            
            <div className="detail-badge-group">
              <span className={`status-badge ${getStatusClass(ticket.status)}`} style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
                {ticket.status}
              </span>
              <span className={`priority-badge ${getPriorityClass(ticket.priority)}`} style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
                {ticket.priority || 'Medium'} Priority
              </span>
            </div>
          </div>

          {/* Description Block */}
          <div className="detail-block">
            <h3 className="detail-block-title">Description</h3>
            <div className="detail-desc-box">{ticket.description}</div>
          </div>

          {/* Notes Block */}
          <div className="detail-block">
            <h3 className="detail-block-title">Updates & Notes log</h3>
            {ticket.notes.length ? (
              <div className="notes-container">
                {ticket.notes.map((n) => (
                  <div key={n.id} className="note-item">
                    <div className="note-header">
                      <span className="note-author">Support Agent / System Update</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} />
                        {formatDate(n.created_at)}
                      </span>
                    </div>
                    <p className="note-text">{n.note_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted" style={{ fontStyle: 'italic' }}>No notes or updates logged for this ticket yet.</p>
            )}
          </div>

          {/* Update Ticket Form Block */}
          <div className="detail-block" style={{ marginTop: 40 }}>
            <h3 className="detail-block-title">Update Ticket Status & Notes</h3>
            <div className="update-form">
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Add Note / Progress Update</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  placeholder="Type an update or internal note here..."
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div className="update-controls-row">
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Change Status</label>
                  <select 
                    className="form-select"
                    value={statusValue} 
                    onChange={(e) => setStatusValue(e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Change Priority</label>
                  <select 
                    className="form-select"
                    value={priorityValue} 
                    onChange={(e) => setPriorityValue(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <button 
                  className="btn-primary" 
                  onClick={handleSave} 
                  disabled={saving}
                  style={{ marginTop: 22, height: 42 }}
                >
                  <Send size={14} />
                  <span>{saving ? 'Saving...' : 'Save Update'}</span>
                </button>
              </div>

              {updateResult && (
                <div className={updateResult.type === 'success' ? 'success-msg' : 'error-msg'} style={{ marginTop: 16 }}>
                  {updateResult.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
