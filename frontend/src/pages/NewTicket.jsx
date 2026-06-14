import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/tickets';
import { Send, X } from 'lucide-react';

export default function NewTicket() {
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    priority: 'Medium',
    description: '',
  });
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const data = await createTicket(form);
      setResult({ type: 'success', message: `Ticket ${data.ticket_id} created successfully!` });
      setForm({ customer_name: '', customer_email: '', subject: '', priority: 'Medium', description: '' });
      // Redirect to list after short delay
      setTimeout(() => {
        navigate('/tickets');
      }, 1500);
    } catch (err) {
      setResult({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-container">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div className="page-header-info">
          <h1 className="page-title">Create New Ticket</h1>
          <span className="page-subtitle">Fill in the details below to create a new support ticket.</span>
        </div>
      </div>

      <div className="card form-card">
        <form onSubmit={handleSubmit} style={{ display: 'block', maxWidth: '100%' }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="customer_name">Customer Name *</label>
              <input
                id="customer_name"
                type="text"
                name="customer_name"
                className="form-input"
                placeholder="John Doe"
                value={form.customer_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="customer_email">Customer Email *</label>
              <input
                id="customer_email"
                type="email"
                name="customer_email"
                className="form-input"
                placeholder="john@example.com"
                value={form.customer_email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="subject">Issue Subject *</label>
              <input
                id="subject"
                type="text"
                name="subject"
                className="form-input"
                placeholder="Brief description of the issue"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                className="form-select"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="description">Issue Description *</label>
              <textarea
                id="description"
                name="description"
                rows="5"
                className="form-textarea"
                placeholder="Provide a detailed description of the issue..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-footer">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/tickets')}
              disabled={submitting}
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={submitting}
            >
              <Send size={16} />
              <span>{submitting ? 'Creating...' : 'Create Ticket'}</span>
            </button>
          </div>
        </form>

        {result && (
          <div className={result.type === 'success' ? 'success-msg' : 'error-msg'} style={{ marginTop: 20 }}>
            {result.message}
          </div>
        )}
      </div>
    </section>
  );
}
