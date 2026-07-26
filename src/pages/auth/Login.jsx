import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [role, setRole] = useState('staff');
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.username) e.username = 'Username is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const res = await login(form.username, form.password);
    if (res.ok) {
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } else {
      setErrors({ general: res.error });
      toast.error(res.error);
    }
    setLoading(false);
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '', general: '' })); };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <div className="logo-box">🚚</div>
            <h1>MI Logistics</h1>
          </div>
          <div className="auth-tagline">
            Fast, Secure &<br /><span>Reliable</span> Parcel Services
          </div>
          <p className="auth-desc">
            Your trusted logistics partner in Virudhunagar, Tamil Nadu. We deliver more than packages — we deliver trust.
          </p>
          <div className="auth-stats">
            <div>
              <div className="auth-stat-num">15K+</div>
              <div className="auth-stat-lbl">Shipments Delivered</div>
            </div>
            <div>
              <div className="auth-stat-num">98%</div>
              <div className="auth-stat-lbl">On-Time Delivery</div>
            </div>
            <div>
              <div className="auth-stat-num">500+</div>
              <div className="auth-stat-lbl">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2>Welcome back</h2>
          <p>Sign in to your MI Logistics account</p>

          {/* Who's signing in? */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16, marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => setRole('staff')}
              className="btn"
              style={{
                flex: 1, justifyContent: 'center',
                background: role === 'staff' ? 'var(--brand-primary)' : 'var(--bg-surface-2)',
                color: role === 'staff' ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
              }}
            >
              Staff / Admin
            </button>
            <button
              type="button"
              onClick={() => navigate('/track')}
              className="btn"
              style={{
                flex: 1, justifyContent: 'center',
                background: 'var(--bg-surface-2)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
              }}
            >
              Customer — Track a Shipment
            </button>
          </div>

          {errors.general && (
            <div style={{ background: '#FEE2E2', color: '#991B1B', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username <span className="required">*</span></label>
              <div className="form-control-icon">
                <span className="input-icon"><FiUser /></span>
                <input
                  className={`form-control ${errors.username ? 'form-control-error' : ''}`}
                  type="text"
                  placeholder="admin"
                  value={form.username}
                  onChange={e => set('username', e.target.value)}
                  style={{ borderColor: errors.username ? 'var(--brand-danger)' : undefined }}
                />
              </div>
              {errors.username && <p className="form-error">⚠ {errors.username}</p>}
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                <label className="form-label" style={{ margin: 0 }}>Password <span className="required">*</span></label>
                <Link to="/forgot-password" className="auth-link" style={{ fontSize: 13 }}>Forgot password?</Link>
              </div>
              <div className="password-field">
                <div className="form-control-icon">
                  <span className="input-icon"><FiLock /></span>
                  <input
                    className="form-control"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    style={{ paddingRight: 44, borderColor: errors.password ? 'var(--brand-danger)' : undefined }}
                  />
                </div>
                <button type="button" className="password-toggle" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">⚠ {errors.password}</p>}
            </div>

            <div className="form-group flex items-center gap-2">
              <input type="checkbox" id="remember" style={{ accentColor: 'var(--brand-accent)' }} />
              <label htmlFor="remember" style={{ fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              disabled={loading}
              style={{ justifyContent: 'center', marginTop: 8 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">Sign In <FiArrowRight /></span>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/signup" className="auth-link" style={{ fontWeight: 600 }}>Sign up</Link>
          </p>

          <div style={{ marginTop: 20, padding: '16px', background: 'var(--bg-surface-2)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Demo Credentials</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Username: <strong>admin</strong></p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Password: <strong>admin123</strong></p>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
