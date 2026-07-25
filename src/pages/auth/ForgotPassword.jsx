import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    toast.success('Reset link sent!');
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <div className="logo-box">🚚</div>
            <h1>MI Logistics</h1>
          </div>
          <div className="auth-tagline">Reset Your<br /><span>Password</span></div>
          <p className="auth-desc">No worries! Enter your registered email address and we'll send you a link to reset your password.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
            <FiArrowLeft /> Back to Login
          </Link>

          {!sent ? (
            <>
              <h2>Forgot Password?</h2>
              <p style={{ marginBottom: 32 }}>Enter your email and we'll send you reset instructions.</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address <span className="required">*</span></label>
                  <div className="form-control-icon">
                    <span className="input-icon"><FiMail /></span>
                    <input
                      className="form-control"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      style={{ borderColor: error ? 'var(--brand-danger)' : undefined }}
                    />
                  </div>
                  {error && <p className="form-error">⚠ {error}</p>}
                </div>

                <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} style={{ justifyContent: 'center' }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 72, height: 72, background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--brand-success)', fontSize: 32 }}>
                <FiCheckCircle />
              </div>
              <h2 style={{ marginBottom: 8 }}>Email Sent!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
                We've sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
              </p>
              <Link to="/login" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center', display: 'flex' }}>
                Back to Login
              </Link>
              <button
                onClick={() => setSent(false)}
                style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--brand-accent)', cursor: 'pointer', fontSize: 14 }}
              >
                Try a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
