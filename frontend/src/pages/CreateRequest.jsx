import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Stepper from '../components/Stepper';
import { getServiceIcon } from '../utils/serviceIcons';
import api from '../api/axios';

const STEPS = ['Service', 'Details', 'Review'];

function CreateRequest() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/services').then((res) => setCategories(res.data.data));
  }, []);

  const selectedCategory = categories.find((c) => c._id === category);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/requests',
        { category, description, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/my-requests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request');
    }
  };

  return (
    <Layout>
      <h2 style={{ marginBottom: 'var(--space-5)' }}>Book a Service</h2>
      <Stepper steps={STEPS} currentStep={step} />

      <Card style={{ maxWidth: 640 }}>
        {step === 1 && (
          <>
            <h3 style={{ marginBottom: 'var(--space-1)' }}>Select a Service</h3>
            <p style={{ marginBottom: 'var(--space-4)' }}>Choose the service you need</p>
            <div className="grid grid-3">
              {categories.map((cat) => {
                const { icon: Icon, bg, color } = getServiceIcon(cat.name);
                const selected = category === cat._id;
                return (
                  <div
                    key={cat._id}
                    onClick={() => setCategory(cat._id)}
                    style={{
                      textAlign: 'center',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: selected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: selected ? 'var(--color-primary-light)' : 'var(--color-bg)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                        background: bg, color, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto var(--space-2)',
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <strong style={{ fontSize: '0.9rem' }}>{cat.name}</strong>
                  </div>
                );
              })}
            </div>
            <div className="row" style={{ justifyContent: 'flex-end', marginTop: 'var(--space-5)' }}>
              <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} disabled={!category} onClick={() => setStep(2)}>
                Next →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 style={{ marginBottom: 'var(--space-1)' }}>Describe Your Problem</h3>
            <p style={{ marginBottom: 'var(--space-4)' }}>Tell us more about the issue and your location</p>
            <div className="field-group">
              <label>Problem description</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="E.g. Fan is not working, needs repair" />
            </div>
            <div className="field-group">
              <label>Your location</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" />
            </div>
            <div className="row" style={{ justifyContent: 'space-between', marginTop: 'var(--space-5)' }}>
              <button style={{ width: 'auto', padding: '10px 24px', background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} onClick={() => setStep(1)}>
                ← Back
              </button>
              <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} disabled={!description || !address} onClick={() => setStep(3)}>
                Next →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 style={{ marginBottom: 'var(--space-1)' }}>Review Your Request</h3>
            <p style={{ marginBottom: 'var(--space-4)' }}>Please confirm your details</p>
            <div className="stack" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Service</span>
                <strong>{selectedCategory?.name}</strong>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Description</span>
                <strong>{description}</strong>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Location</span>
                <strong>{address}</strong>
              </div>
            </div>
            {error && <div className="auth-error">{error}</div>}
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <button style={{ width: 'auto', padding: '10px 24px', background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} onClick={() => setStep(2)}>
                ← Back
              </button>
              <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={handleSubmit}>
                Submit Request
              </button>
            </div>
          </>
        )}
      </Card>
    </Layout>
  );
}

export default CreateRequest;