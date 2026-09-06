import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { getServiceIcon } from '../utils/serviceIcons';
import api from '../api/axios';

const ALL_SERVICES = ['Electrician', 'Plumber', 'Carpenter', 'AC Repair', 'Cleaning', 'Appliance Repair'];

function ProviderSetup() {
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const toggleService = (service) => {
    setSelected((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async () => {
    try {
      await api.put(
        '/providers/profile',
        { services: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/provider-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    }
  };

  return (
    <Layout>
      <h2 style={{ marginBottom: 'var(--space-1)' }}>Set Up Your Provider Profile</h2>
      <p style={{ marginBottom: 'var(--space-5)' }}>Select the services you offer to start receiving requests</p>

      <Card style={{ maxWidth: 560 }}>
        <div className="grid grid-3" style={{ marginBottom: 'var(--space-5)' }}>
          {ALL_SERVICES.map((service) => {
            const { icon: Icon, bg, color } = getServiceIcon(service);
            const isSelected = selected.includes(service);
            return (
              <div
                key={service}
                onClick={() => toggleService(service)}
                style={{
                  textAlign: 'center',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: isSelected ? 'var(--color-primary-light)' : 'var(--color-bg)',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: bg, color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-2)',
                }}>
                  <Icon size={20} />
                </div>
                <strong style={{ fontSize: '0.85rem' }}>{service}</strong>
              </div>
            );
          })}
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button className="btn-primary" disabled={selected.length === 0} onClick={handleSubmit}>
          Save and Continue
        </button>
      </Card>
    </Layout>
  );
}

export default ProviderSetup;