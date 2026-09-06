function Card({ children, style, ...props }) {
  return (
    <div
      style={{
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-5)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;