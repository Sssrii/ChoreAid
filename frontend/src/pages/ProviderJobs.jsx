import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { getServiceIcon } from '../utils/serviceIcons';
import api from '../api/axios';

const NEXT_STATUS = {
  ACCEPTED: 'PROVIDER_ON_WAY',
  PROVIDER_ON_WAY: 'ARRIVED',
  ARRIVED: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
};

const TABS = ['Active', 'Completed', 'Cancelled'];

const isActive = (status) => !['COMPLETED', 'CANCELLED'].includes(status);

function ProviderJobs() {
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState('Active');
  const token = localStorage.getItem('token');

  const fetchJobs = async () => {
    const res = await api.get('/requests/assigned', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setJobs(res.data.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const advanceStatus = async (jobId, currentStatus) => {
    const newStatus = NEXT_STATUS[currentStatus];
    if (!newStatus) return;

    await api.put(
      `/requests/${jobId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchJobs();
  };

  const filtered = jobs.filter((j) => {
    if (tab === 'Active') return isActive(j.status);
    if (tab === 'Completed') return j.status === 'COMPLETED';
    if (tab === 'Cancelled') return j.status === 'CANCELLED';
    return true;
  });

  const countFor = (t) => jobs.filter((j) => {
    if (t === 'Active') return isActive(j.status);
    if (t === 'Completed') return j.status === 'COMPLETED';
    if (t === 'Cancelled') return j.status === 'CANCELLED';
    return true;
  }).length;

  return (
    <Layout>
      <h2 style={{ marginBottom: 'var(--space-5)' }}>My Jobs</h2>

      <div className="row" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--color-border)' }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              width: 'auto', background: 'none', border: 'none', padding: '10px 16px',
              fontWeight: 600, fontSize: '0.9rem',
              color: tab === t ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: tab === t ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            {t} ({countFor(t)})
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p>No jobs in this category.</p>}

      <div className="stack">
        {filtered.map((job) => {
          const { icon: Icon, bg, color } = getServiceIcon(job.category?.name);
          return (
            <Card key={job._id}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="row">
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: bg, color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <strong>{job.category?.name}</strong>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>{job.description}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>{job.address}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={job.status} />
                  {NEXT_STATUS[job.status] && (
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      <button
                        className="btn-primary"
                        style={{ width: 'auto', padding: '6px 14px', fontSize: '0.8rem' }}
                        onClick={() => advanceStatus(job._id, job.status)}
                      >
                        Mark as {NEXT_STATUS[job.status].replace(/_/g, ' ')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
}

export default ProviderJobs;