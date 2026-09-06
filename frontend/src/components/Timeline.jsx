import { Check } from 'lucide-react';

const STEPS_ORDER = ['REQUESTED', 'MATCHING', 'ACCEPTED', 'PROVIDER_ON_WAY', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'];
const STEP_LABELS = {
  REQUESTED: 'Request Placed',
  MATCHING: 'Finding a Provider',
  ACCEPTED: 'Provider Accepted',
  PROVIDER_ON_WAY: 'Provider On The Way',
  ARRIVED: 'Arrived at Location',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

function Timeline({ currentStatus }) {
  if (currentStatus === 'CANCELLED') {
    return <p style={{ color: 'var(--color-danger)', fontWeight: 600 }}>This request was cancelled.</p>;
  }

  const currentIndex = STEPS_ORDER.indexOf(currentStatus);

  return (
    <div className="stack" style={{ gap: 0 }}>
      {STEPS_ORDER.map((step, index) => {
        const done = index <= currentIndex;
        const isLast = index === STEPS_ORDER.length - 1;

        return (
          <div key={step} className="row" style={{ alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <div className="stack" style={{ alignItems: 'center', gap: 0 }}>
              <div
                style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: done ? 'var(--color-primary)' : 'var(--color-bg-alt)',
                  border: done ? 'none' : '1px solid var(--color-border)',
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {done && <Check size={14} />}
              </div>
              {!isLast && (
                <div style={{ width: 2, flex: 1, minHeight: 32, background: done ? 'var(--color-primary)' : 'var(--color-border)' }} />
              )}
            </div>
            <p style={{ fontWeight: done ? 600 : 400, color: done ? 'var(--color-text)' : 'var(--color-text-muted)', paddingBottom: 'var(--space-4)' }}>
              {STEP_LABELS[step]}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default Timeline;