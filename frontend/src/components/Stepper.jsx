function Stepper({ steps, currentStep }) {
  return (
    <div className="row" style={{ marginBottom: 'var(--space-6)', gap: 'var(--space-2)' }}>
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <div key={label} className="row" style={{ flex: 1, gap: 'var(--space-2)' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                flexShrink: 0,
                background: isDone || isActive ? 'var(--color-primary)' : 'var(--color-bg-alt)',
                color: isDone || isActive ? '#fff' : 'var(--color-text-muted)',
                border: isDone || isActive ? 'none' : '1px solid var(--color-border)',
              }}
            >
              {stepNum}
            </div>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
              }}
            >
              {label}
            </span>
            {stepNum < steps.length && (
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Stepper;