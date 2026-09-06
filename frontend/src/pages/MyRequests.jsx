import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { getServiceIcon } from '../utils/serviceIcons';
import api from '../api/axios';
import socket from '../api/socket';

const TABS = ['All', 'Active', 'Completed', 'Cancelled'];

const isActive = (status) => !['COMPLETED', 'CANCELLED'].includes(status);

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState('All');
  const token = localStorage.getItem('token');

  const fetchRequests = async () => {
    const res = await api.get('/requests/my', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests(res.data.data);
  };

  useEffect(() => {
    fetchRequests();

    const payload = JSON.parse(atob(token.split('.')[1]));
    socket.emit('register', payload.id);
    socket.on('requestAccepted', () => fetchRequests());
    socket.on('statusUpdated', () => fetchRequests());

    return () => {
      socket.off('requestAccepted');
      socket.off('statusUpdated');
    };
  }, []);

  const filtered = requests.filter((r) => {
    if (tab === 'All') return true;
    if (tab === 'Active') return isActive(r.status);
    if (tab === 'Completed') return r.status === 'COMPLETED';
    if (tab === 'Cancelled') return r.status === 'CANCELLED';
    return true;
  });

  const countFor = (t) => requests.filter((r) => {
    if (t === 'All') return true;
    if (t === 'Active') return isActive(r.status);
    if (t === 'Completed') return r.status === 'COMPLETED';
    if (t === 'Cancelled') return r.status === 'CANCELLED';
    return true;
  }).length;

  return (
    <Layout>
      <h2 style={{ marginBottom: 'var(--space-5)' }}>My Requests</h2>

      <div className="row" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--color-border)' }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              width: 'auto',
              background: 'none',
              border: 'none',
              padding: '10px 16px',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: tab === t ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: tab === t ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            {t} ({countFor(t)})
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p>No requests in this category.</p>}

      <div className="stack">
        {filtered.map((req) => {
          const { icon: Icon, bg, color } = getServiceIcon(req.category?.name);
          return (
            <Card key={req._id}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="row">
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                      background: bg, color, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <strong>{req.category?.name}</strong>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>{req.description}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={req.status} />
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    <Link
                      to={`/request/${req._id}`}
                      style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
}

export default MyRequests;