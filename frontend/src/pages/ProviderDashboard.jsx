import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { getServiceIcon } from '../utils/serviceIcons';
import api from '../api/axios';

function ProviderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    // Reuse the profile update endpoint's return by fetching via availability toggle read isn't ideal;
    // simplest honest option: fetch assigned jobs to compute a "Total Jobs" count client-side.
    const res = await api.get('/requests/assigned', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAssignedJobs(res.data.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleOnline = async () => {
    const res = await api.put(
      '/providers/availability',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setIsOnline(res.data.data.isOnline);
  };

  const findNearby = async () => {
    try {
      const res = await api.get('/requests/nearby', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNearbyRequests(res.data.data);
    } catch (err) {
      setMessage('Could not fetch nearby requests');
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await api.put(
        `/requests/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Request accepted!');
      findNearby();
      fetchProfile();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to accept');
    }
  };

  const totalJobs = assignedJobs.length;
  const todaysJobs = assignedJobs.filter((j) => {
    const jobDate = new Date(j.updatedAt).toDateString();
    return jobDate === new Date().toDateString();
  }).length;

  return (
    <Layout>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
        <div>
          <h2 style={{ marginBottom: 'var(--space-1)' }}>Good day! 👋</h2>
          <p>Here's what's happening today.</p>
        </div>
        <div className="row">
          <span style={{ fontWeight: 600 }}>{isOnline ? 'Online' : 'Offline'}</span>
          <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
            <input
              type="checkbox"
              checked={isOnline}
              onChange={toggleOnline}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              onClick={toggleOnline}
              style={{
                position: 'absolute', cursor: 'pointer', inset: 0,
                background: isOnline ? 'var(--color-primary)' : 'var(--color-border)',
                borderRadius: 999, transition: '0.2s',
              }}
            >
              <span
                style={{
                  position: 'absolute', height: 18, width: 18, left: isOnline ? 23 : 3, top: 3,
                  background: '#fff', borderRadius: '50%', transition: '0.2s',
                }}
              />
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <Card style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: 'var(--space-1)' }}>Today's Jobs</p>
          <h2>{todaysJobs}</h2>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: 'var(--space-1)' }}>Total Jobs</p>
          <h2>{totalJobs}</h2>
        </Card>
      </div>

      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <h3>Nearby Requests</h3>
        <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px' }} onClick={findNearby}>
          Refresh
        </button>
      </div>

      {message && <p style={{ marginBottom: 'var(--space-3)', fontWeight: 600 }}>{message}</p>}

      <div className="stack">
        {nearbyRequests.length === 0 && <p>No nearby requests right now  - click Refresh to check.</p>}
        {nearbyRequests.map((r) => {
          const { icon: Icon, bg, color } = getServiceIcon(r.category?.name);
          return (
            <Card key={r._id}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="row">
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: bg, color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <strong>{r.category?.name}</strong>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>{r.description}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>{r.address}</p>
                  </div>
                </div>
                <button className="btn-primary" style={{ width: 'auto', padding: '8px 20px' }} onClick={() => acceptRequest(r._id)}>
                  Accept
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
}

export default ProviderDashboard;