import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiPackage, FiMapPin, FiExternalLink, FiCheckCircle, FiTruck, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { publicTrackingService } from '../../services/api';

export default function PublicTrack() {
  const [trackNum, setTrackNum] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackNum.trim()) { setError('Please enter a tracking number'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await publicTrackingService.track(trackNum.trim().toUpperCase());
      setResult(data);
    } catch (err) {
      setError(`No shipment found for "${trackNum}". Please check the tracking number and try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-surface-2, #f5f6fa)', padding: '32px 16px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-primary, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🚚</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>MI Logistics</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Track your shipment — no account needed</p>
        </div>

        {/* Track form */}
        <form onSubmit={handleTrack} className="card" style={{ padding: 20, marginBottom: 20 }}>
          <label className="form-label">Tracking Number</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              className="form-control"
              type="text"
              placeholder="e.g. MIL-2024-001"
              value={trackNum}
              onChange={e => { setTrackNum(e.target.value); setError(''); }}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={loading}>
              <FiSearch size={16} /> {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
          {error && <p className="form-error" style={{ marginTop: 10 }}>⚠ {error}</p>}
        </form>

        {/* Result */}
        {result && (
          <div className="card" style={{ padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Tracking Number</p>
                <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{result.trackingNumber}</p>
              </div>
              <span className="badge" style={{ background: 'var(--brand-primary-light, #fff2e6)', color: 'var(--brand-primary, #f97316)', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                {result.statusLabel}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20, fontSize: 14 }}>
              <div>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 4px' }}>From</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{result.origin}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 4px' }}>To</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{result.destination}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 4px' }}>Weight</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{result.weight}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 4px' }}>ETA</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{result.eta}</p>
              </div>
            </div>

            {/* Timeline */}
            {result.events?.length > 0 && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Tracking History</p>
                {result.events.map((ev, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: ev.done ? 'var(--brand-success, #22c55e)' : ev.active ? 'var(--brand-primary, #f97316)' : '#e5e7eb',
                        color: (ev.done || ev.active) ? '#fff' : '#9ca3af', flexShrink: 0,
                      }}>
                        {ev.done ? <FiCheckCircle size={14} /> : ev.active ? <FiTruck size={14} /> : <FiClock size={14} />}
                      </div>
                      {i < result.events.length - 1 && <div style={{ width: 2, flex: 1, background: '#e5e7eb', marginTop: 2 }} />}
                    </div>
                    <div style={{ paddingBottom: 4 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{ev.title}</p>
                      {ev.desc && <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>{ev.desc}</p>}
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{ev.location} · {ev.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Office location */}
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><FiMapPin size={16} /> Our Office Location</span>
            <a
              href="https://www.google.com/maps?cid=4773867466376486429"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm flex items-center gap-2"
            >
              Open in Google Maps <FiExternalLink size={13} />
            </a>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
            MI Logistics — Virudhunagar, Tamil Nadu, India
          </p>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <iframe
              title="MI Logistics Office Location - Virudhunagar"
              src="https://www.google.com/maps?cid=4773867466376486429&output=embed"
              width="100%"
              height="280"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          Are you MI Logistics staff? <Link to="/login" className="auth-link">Sign in here</Link>
        </p>
      </div>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/919363252243"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat with us on WhatsApp"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#25D366',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
          zIndex: 1000,
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <FaWhatsapp />
      </a>
    </div>
  );
}
