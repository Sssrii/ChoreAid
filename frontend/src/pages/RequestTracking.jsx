import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import Timeline from '../components/Timeline';
import api from '../api/axios';
import socket from '../api/socket';

function RequestTracking() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [payment, setPayment] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchRequest = async () => {
    const res = await api.get('/requests/my', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const found = res.data.data.find((r) => r._id === id);
    setRequest(found);

    if (found?.status === 'COMPLETED') {
      try {
        const payRes = await api.get(`/payments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayment(payRes.data.data);
      } catch {
        setPayment(null);
      }
    }
  };

  useEffect(() => {
    fetchRequest();
    const payload = JSON.parse(atob(token.split('.')[1]));
    socket.emit('register', payload.id);
    socket.on('requestAccepted', () => fetchRequest());
    socket.on('statusUpdated', () => fetchRequest());
    return () => {
      socket.off('requestAccepted');
      socket.off('statusUpdated');
    };
  }, [id]);

  const submitReview = async () => {
    try {
      await api.post(
        '/reviews',
        { requestId: id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Review submitted  - thank you!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const payNow = async () => {
    try {
      const res = await api.post(
        '/payments',
        { requestId: id, amount: 500 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayment(res.data.data);
      setMessage('Payment successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Payment failed');
    }
  };

  if (!request) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <Link to="/my-requests" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>← Back to My Requests</Link>

      <div className="row" style={{ justifyContent: 'space-between', margin: 'var(--space-3) 0 var(--space-5)' }}>
        <div>
          <h2 style={{ marginBottom: 'var(--space-1)' }}>{request.category?.name}</h2>
          <p>{request.description}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
        <Card>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Status</h3>
          <Timeline currentStatus={request.status} />
        </Card>

        <div className="stack">
          <Card>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Service Details</h3>
            <div className="stack">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Address</span>
                <strong>{request.address}</strong>
              </div>
            </div>
          </Card>

          {request.status === 'COMPLETED' && (
            <Card>
              <h3 style={{ marginBottom: 'var(--space-3)' }}>Payment</h3>
              {payment?.status === 'SUCCEEDED' ? (
                <p style={{ color: 'var(--color-success)', fontWeight: 600 }}>Payment completed ✓ (₹{payment.amount})</p>
              ) : (
                <button className="btn-primary" onClick={payNow}>Pay Now (₹500)</button>
              )}
            </Card>
          )}

          {request.status === 'COMPLETED' && (
            <Card>
              <h3 style={{ marginBottom: 'var(--space-3)' }}>Rate Your Experience</h3>
              <div className="row" style={{ marginBottom: 'var(--space-3)' }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    onClick={() => setRating(n)}
                    style={{ cursor: 'pointer', fontSize: '1.5rem', color: n <= rating ? '#f5a623' : 'var(--color-border)' }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                rows={3}
                placeholder="Share your feedback..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ marginBottom: 'var(--space-3)' }}
              />
              <button className="btn-primary" onClick={submitReview}>Submit Review</button>
            </Card>
          )}

          {message && <p style={{ color: 'var(--color-success)', fontWeight: 600 }}>{message}</p>}
        </div>
      </div>
    </Layout>
  );
}

export default RequestTracking;