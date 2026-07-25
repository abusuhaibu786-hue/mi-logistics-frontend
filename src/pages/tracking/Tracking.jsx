import { useState } from 'react';
import { FiSearch, FiMapPin, FiPackage, FiCalendar, FiUser, FiTruck } from 'react-icons/fi';
import { shipmentService } from '../../services/api';
import { StatusBadge } from '../../components/common/UIComponents';
import { formatDate } from '../../utils/helpers';

export default function Tracking() {
  const [trackNum, setTrackNum] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackNum.trim()) { setError('Please enter a tracking number'); return; }
    setLoading(true);
    setError('');
    try {
      const { data } = await shipmentService.trackByNumber(trackNum.trim().toUpperCase());
      setResult({
        trackingNumber: data.trackingNumber,
        customer: data.customer,
        origin: data.origin,
        destination: data.destination,
        status: data.status,
        estimatedDelivery: data.estimatedDelivery,
        weight: data.weight,
        service: data.priority,
        events: data.trackingEvents,
      });
    } catch (err) {
      setResult(null);
      setError(`No shipment found for "${trackNum}". Try MIL-2024-001 or MIL-2024-002`);
    } finally {
      setLoading(false);
    }
  };

  const demoTrack = (num) => { setTrackNum(num); setResult(null); setError(''); };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Track Shipment</h1>
          <p>Enter a tracking number to get real-time shipment status</p>
        </div>
      </div>

      {/* Hero search */}
      <div className="tracking-hero">
        <h2>🚚 Track Your Parcel</h2>
        <p>Enter your MI Logistics tracking number below</p>
        <div className="tracking-input-group">
          <input
            className="form-control"
            placeholder="e.g. MIL-2024-001"
            value={trackNum}
            onChange={e => { setTrackNum(e.target.value.toUpperCase()); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleTrack()}
          />
          <button className="btn btn-primary btn-lg" onClick={handleTrack} disabled={loading}>
            {loading ? '...' : <><FiSearch size={16} /> Track</>}
          </button>
        </div>
        {error && <p style={{ color: '#FCA5A5', marginTop: 14, fontSize: 14 }}>⚠ {error}</p>}
        <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Try:</span>
          {['MIL-2024-001', 'MIL-2024-002'].map(n => (
            <button key={n} onClick={() => demoTrack(n)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'monospace' }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="grid grid-2-1">
          {/* Timeline */}
          <div className="card">
            <div className="card-header">
              <span className="card-title"><FiMapPin size={16} /> Shipment Timeline</span>
              <StatusBadge status={result.status} />
            </div>
            <div className="card-body" style={{ paddingTop: 8 }}>
              <div className="tracking-timeline">
                <div className="timeline-line" />
                {result.events.map((event, i) => (
                  <div key={i} className="timeline-item">
                    <div className={`timeline-dot ${event.active ? 'active' : event.done ? 'done' : ''}`} style={{ marginLeft: 19 }} />
                    <div className="timeline-content" style={{ paddingLeft: 4 }}>
                      <div className="timeline-title" style={{ color: event.active ? 'var(--brand-accent)' : event.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {event.active && '📍 '}{event.title}
                      </div>
                      <div className="timeline-desc">{event.desc}</div>
                      <div className="timeline-time">📍 {event.location} · 🕐 {event.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Shipment Info */}
            <div className="card">
              <div className="card-header"><span className="card-title"><FiPackage size={16} /> Package Info</span></div>
              <div className="card-body" style={{ paddingTop: 8 }}>
                {[
                  { icon: FiPackage, label: 'Tracking No.', val: result.trackingNumber, mono: true, accent: true },
                  { icon: FiUser, label: 'Customer', val: result.customer },
                  { icon: FiMapPin, label: 'From', val: result.origin },
                  { icon: FiMapPin, label: 'To', val: result.destination },
                  { icon: FiTruck, label: 'Service', val: result.service },
                  { icon: FiPackage, label: 'Weight', val: result.weight },
                  { icon: FiCalendar, label: 'Est. Delivery', val: formatDate(result.estimatedDelivery) },
                ].map(({ icon: Icon, label, val, mono, accent }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color="var(--text-muted)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, fontFamily: mono ? 'monospace' : undefined, color: accent ? 'var(--brand-accent)' : undefined }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="card">
              <div className="card-header"><span className="card-title">Delivery Progress</span></div>
              <div className="card-body" style={{ paddingTop: 8 }}>
                {(() => {
                  const done = result.events.filter(e => e.done || e.active).length;
                  const total = result.events.length;
                  const pct = Math.round((done / total) * 100);
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{done} of {total} stages</span>
                        <span style={{ fontWeight: 700, color: 'var(--brand-accent)' }}>{pct}%</span>
                      </div>
                      <div style={{ height: 8, background: 'var(--bg-surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--brand-accent), #FBBF24)', borderRadius: 4, transition: 'width 1s ease' }} />
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
                        {result.status === 'delivered' ? '✅ Successfully delivered!' : `📍 Currently: ${result.events.find(e => e.active)?.title || 'Processing'}`}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>Enter a Tracking Number</h3>
              <p>Track your parcels in real-time with MI Logistics tracking system</p>
              <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ background: 'var(--bg-surface-2)', borderRadius: 10, padding: '16px 20px', textAlign: 'left', minWidth: 200 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Tracking No.</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-accent)' }}>MIL-2024-001</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Arjun Sharma • Chennai</div>
                  <div style={{ marginTop: 8 }}><span className="badge badge-success">● Delivered</span></div>
                </div>
                <div style={{ background: 'var(--bg-surface-2)', borderRadius: 10, padding: '16px 20px', textAlign: 'left', minWidth: 200 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Tracking No.</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-accent)' }}>MIL-2024-002</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Priya Nair • Coimbatore</div>
                  <div style={{ marginTop: 8 }}><span className="badge badge-info">● In Transit</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
