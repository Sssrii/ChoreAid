const statusStyles = {
  REQUESTED: { bg: 'var(--color-info-bg)', color: 'var(--color-info)' },
  MATCHING: { bg: 'var(--color-info-bg)', color: 'var(--color-info)' },
  ACCEPTED: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
  PROVIDER_ON_WAY: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
  ARRIVED: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
  IN_PROGRESS: { bg: 'var(--color-info-bg)', color: 'var(--color-info)' },
  COMPLETED: { bg: 'var(--color-success-bg)', color: 'var(--color-success)' },
  CANCELLED: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)' },
};

function StatusBadge({ status }) {
  const style = statusStyles[status] || statusStyles.REQUESTED;
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default StatusBadge;