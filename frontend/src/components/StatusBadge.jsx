export default function StatusBadge({ status }) {
  const cls =
    status === 'Open' ? 'status-open'
    : status === 'In Progress' ? 'status-inprogress'
    : 'status-closed';

  return <span className={`status-badge ${cls}`}>{status}</span>;
}
