import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.data);
    } catch (err) {
      setMessage('Could not load requests (admin access required)');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const totalRequests = requests.length;
  const completed = requests.filter((r) => r.status === 'COMPLETED').length;
  const active = requests.filter((r) => !['COMPLETED', 'CANCELLED'].includes(r.status)).length;
  const cancelled = requests.filter((r) => r.status === 'CANCELLED').length;

  return (
    <Layout>
      <h2 style={{ marginBottom: 'var(--space-5)' }}>Admin Dashboard</h2>

      {message && <p style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-4)' }}>{message}</p>}

      <div className="grid grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <Card style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: 'var(--space-1)' }}>Total Requests</p>
          <h2>{totalRequests}</h2>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: 'var(--space-1)' }}>Active</p>
          <h2>{active}</h2>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: 'var(--space-1)' }}>Completed</p>
          <h2>{completed}</h2>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: 'var(--space-1)' }}>Cancelled</p>
          <h2>{cancelled}</h2>
        </Card>
      </div>

      <h3 style={{ marginBottom: 'var(--space-3)' }}>All Service Requests</h3>
      <div className="stack">
        {requests.map((req) => (
          <Card key={req._id}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <strong>{req.category?.name}</strong>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  Customer: {req.customer?.name} ({req.customer?.email})
                </p>
                {req.assignedProvider && (
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>
                    Provider: {req.assignedProvider?.name}
                  </p>
                )}
              </div>
              <StatusBadge status={req.status} />
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
}

export default AdminDashboard;