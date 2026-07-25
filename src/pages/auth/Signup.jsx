import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', name: '', phone: '', password: '', password2: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required';
    if (!form.username) e.username = 'Username is required';
    else if (form.username.length < 3) e.username = 'Minimum 3 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.password2 !== form.password) e.password2 = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const res = await signup({
      username: form.username,
      email: form.email,
      name: form.name,
      phone: form.phone,
      password: form.password,
      password2: form.password2,
    });
    if (res.ok) {
      toast.success('Account created! Welcome 👋');
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
            Join Us &<br /><span>Get Started</span>
          </div>
          <p className="auth-desc">
            Create your account to manage shipments with your trusted logistics partner in Virudhunagar, Tamil Nadu.
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
          <h2>Create your account</h2>
          <p>Sign up for MI Logistics in a few seconds</p>

          {errors.general && (
            <div style={{ background: '#FEE2E2', color: '#991B1B', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <div className="form-control-icon">
                <span className="input-icon"><FiUser /></span>
                <input
                  className={`form-control ${errors.name ? 'form-control-error' : ''}`}
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  style={{ borderColor: errors.name ? 'var(--brand-danger)' : undefined }}
                />
              </div>
              {errors.name && <p className="form-error">⚠ {errors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Username <span className="required">*</span></label>
              <div className="form-control-icon">
                <span className="input-icon"><FiUser /></span>
                <input
                  className={`form-control ${errors.username ? 'form-control-error' : ''}`}
                  type="text"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={e => set('username', e.target.value)}
                  style={{ borderColor: errors.username ? 'var(--brand-danger)' : undefined }}
                />
              </div>
              {errors.username && <p className="form-error">⚠ {errors.username}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address <span className="required">*</span></label>
              <div className="form-control-icon">
                <span className="input-icon"><FiMail /></span>
                <input
                  className={`form-control ${errors.email ? 'form-control-error' : ''}`}
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  style={{ borderColor: errors.email ? 'var(--brand-danger)' : undefined }}
                />
              </div>
              {errors.email && <p className="form-error">⚠ {errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="form-control-icon">
                <span className="input-icon"><FiPhone /></span>
                <input
                  className="form-control"
                  type="tel"
                  placeholder="+91 90000 00000"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password <span className="required">*</span></label>
              <div className="password-field">
                <div className="form-control-icon">
                  <span className="input-icon"><FiLock /></span>
                  <input
                    className="form-control"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Create a password"
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

            <div className="form-group">
              <label className="form-label">Confirm Password <span className="required">*</span></label>
              <div className="form-control-icon">
                <span className="input-icon"><FiLock /></span>
                <input
                  className="form-control"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.password2}
                  onChange={e => set('password2', e.target.value)}
                  style={{ borderColor: errors.password2 ? 'var(--brand-danger)' : undefined }}
                />
              </div>
              {errors.password2 && <p className="form-error">⚠ {errors.password2}</p>}
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
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">Create Account <FiArrowRight /></span>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" className="auth-link" style={{ fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
