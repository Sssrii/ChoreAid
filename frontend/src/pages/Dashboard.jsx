import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { getServiceIcon } from '../utils/serviceIcons';
import api from '../api/axios';
import { Navigate } from 'react-router-dom';


function ProviderRedirect() {
  const [checked, setChecked] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    api
      .get('/providers/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setHasProfile(true))
      .catch(() => setHasProfile(false))
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return <p style={{ padding: 'var(--space-6)' }}>Loading...</p>;
  return <Navigate to={hasProfile ? '/provider-dashboard' : '/provider-setup'} />;
}

function Dashboard() {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    api.get('/services').then((res) => setCategories(res.data.data));

    if (role === 'customer') {
      const token = localStorage.getItem('token');
      api
        .get('/requests/my', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setRecentRequests(res.data.data.slice(0, 3)));
    }
  }, [role]);



if (role === 'provider') {
  return <ProviderRedirect />;
}
if (role === 'admin') {
  return <Navigate to="/admin" />;
}

  return (
    <Layout>
      <h2 style={{ marginBottom: 'var(--space-1)' }}>Hello! 👋</h2>
      <p style={{ marginBottom: 'var(--space-5)' }}>What service do you need today?</p>

      <h3 style={{ marginBottom: 'var(--space-3)' }}>Select a Service</h3>
      <div className="grid grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        {categories.map((cat) => {
          const { icon: Icon, bg, color } = getServiceIcon(cat.name);
          return (
            <Card
              key={cat._id}
              style={{ cursor: 'pointer', textAlign: 'center' }}
              onClick={() => navigate('/create-request')}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-sm)',
                  background: bg,
                  color: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-3)',
                }}
              >
                <Icon size={22} />
              </div>
              <strong>{cat.name}</strong>
            </Card>
          );
        })}
      </div>

      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <h3>Recent Requests</h3>
        <a href="/my-requests" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
          View All →
        </a>
      </div>
      <div className="stack">
        {recentRequests.length === 0 && <p>No requests yet  - book your first service above.</p>}
        {recentRequests.map((req) => (
          <Card key={req._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{req.category?.name}</strong>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>{req.description}</p>
            </div>
            <StatusBadge status={req.status} />
          </Card>
        ))}
      </div>
    </Layout>
  );
}

export default Dashboard;