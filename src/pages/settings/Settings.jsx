import { useState } from 'react';
import { FiUser, FiLock, FiBell, FiMonitor, FiSave, FiEye, FiEyeOff, FiCamera } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { TabList, Avatar } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function Settings() {
  const { theme, toggleTheme } = useApp();
  const [tab, setTab] = useState('Company Profile');

  const [profile, setProfile] = useState({
    companyName: 'MI Logistics',
    tagline: 'Fast, Secure & Reliable Parcel Services',
    email: 'info@milogistics.com',
    phone: '+91 9876543210',
    address: '12, Main Road, Virudhunagar, Tamil Nadu 626001',
    gst: '33XXXXX1234X1Z5',
    website: 'www.milogistics.com',
  });

  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [showPwds, setShowPwds] = useState({ current: false, newPwd: false, confirm: false });
  const [pwdErrors, setPwdErrors] = useState({});

  const [notifs, setNotifs] = useState({
    newShipment: true, deliveryConfirm: true, paymentReceived: true,
    staffLeave: false, dailyReport: true, weeklyReport: false,
    smsAlerts: false, emailAlerts: true,
  });

  const accentColors = [
    { name: 'Orange', val: '#F97316' }, { name: 'Blue', val: '#3B82F6' },
    { name: 'Green', val: '#10B981' }, { name: 'Purple', val: '#8B5CF6' },
    { name: 'Red', val: '#EF4444' }, { name: 'Teal', val: '#14B8A6' },
  ];
  const [selectedColor, setSelectedColor] = useState('#F97316');

  const handleSaveProfile = () => toast.success('Company profile updated!');

  const handleChangePwd = () => {
    const e = {};
    if (!pwdForm.current) e.current = 'Current password is required';
    if (!pwdForm.newPwd || pwdForm.newPwd.length < 6) e.newPwd = 'New password must be at least 6 characters';
    if (pwdForm.newPwd !== pwdForm.confirm) e.confirm = 'Passwords do not match';
    if (Object.keys(e).length) { setPwdErrors(e); return; }
    toast.success('Password changed successfully!');
    setPwdForm({ current: '', newPwd: '', confirm: '' });
    setPwdErrors({});
  };

  const ToggleRow = ({ label, desc, stateKey }) => (
    <div className="setting-row">
      <div className="setting-row-info">
        <div className="setting-row-label">{label}</div>
        {desc && <div className="setting-row-desc">{desc}</div>}
      </div>
      <label className="toggle-switch">
        <input type="checkbox" checked={notifs[stateKey]} onChange={e => setNotifs(n => ({ ...n, [stateKey]: e.target.checked }))} />
        <span className="toggle-slider" />
      </label>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Settings</h1>
          <p>Manage your company profile, security, and preferences</p>
        </div>
      </div>

      <TabList tabs={['Company Profile', 'Change Password', 'Notifications', 'Theme']} active={tab} onChange={setTab} />

      {/* Company Profile */}
      {tab === 'Company Profile' && (
        <div style={{ maxWidth: 720 }}>
          <div className="settings-card mb-6">
            <div className="settings-card-header">
              <FiUser color="var(--brand-accent)" size={16} />
              <h3>Company Information</h3>
            </div>
            <div className="settings-card-body">
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '16px 20px', background: 'var(--bg-surface-2)', borderRadius: 10 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--brand-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, color: '#fff' }}>🚚</div>
                  <button style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--brand-primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <FiCamera size={12} />
                  </button>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{profile.companyName}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{profile.tagline}</div>
                  <button style={{ marginTop: 6, fontSize: 12, color: 'var(--brand-accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Change Logo</button>
                </div>
              </div>

              <div className="grid grid-2">
                {[
                  { key: 'companyName', label: 'Company Name', placeholder: 'MI Logistics' },
                  { key: 'tagline', label: 'Tagline', placeholder: 'Fast, Secure & Reliable' },
                  { key: 'email', label: 'Email', type: 'email', placeholder: 'info@milogistics.com' },
                  { key: 'phone', label: 'Phone', placeholder: '+91 9876543210' },
                  { key: 'gst', label: 'GST Number', placeholder: '33XXXXX1234X1Z5' },
                  { key: 'website', label: 'Website', placeholder: 'www.milogistics.com' },
                ].map(field => (
                  <div key={field.key} className="form-group">
                    <label className="form-label">{field.label}</label>
                    <input
                      className="form-control"
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      value={profile[field.key]}
                      onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                    />
                  </div>
                ))}
                <div className="form-group col-span-2">
                  <label className="form-label">Office Address</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={profile.address}
                    onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                  />
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleSaveProfile}><FiSave size={14} /> Save Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password */}
      {tab === 'Change Password' && (
        <div style={{ maxWidth: 480 }}>
          <div className="settings-card">
            <div className="settings-card-header">
              <FiLock color="var(--brand-accent)" size={16} />
              <h3>Change Password</h3>
            </div>
            <div className="settings-card-body">
              <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: 'var(--brand-info)' }}>
                ℹ️ Use a strong password with at least 8 characters, including numbers and symbols.
              </div>
              {[
                { key: 'current', label: 'Current Password', placeholder: 'Enter current password' },
                { key: 'newPwd', label: 'New Password', placeholder: 'Enter new password (min 6 chars)' },
                { key: 'confirm', label: 'Confirm New Password', placeholder: 'Confirm your new password' },
              ].map(field => (
                <div key={field.key} className="form-group">
                  <label className="form-label">{field.label} <span className="required">*</span></label>
                  <div className="password-field">
                    <input
                      className="form-control"
                      type={showPwds[field.key] ? 'text' : 'password'}
                      placeholder={field.placeholder}
                      value={pwdForm[field.key]}
                      onChange={e => { setPwdForm(f => ({ ...f, [field.key]: e.target.value })); setPwdErrors(er => ({ ...er, [field.key]: '' })); }}
                      style={{ borderColor: pwdErrors[field.key] ? 'var(--brand-danger)' : undefined, paddingRight: 44 }}
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowPwds(s => ({ ...s, [field.key]: !s[field.key] }))}>
                      {showPwds[field.key] ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                  {pwdErrors[field.key] && <p className="form-error">⚠ {pwdErrors[field.key]}</p>}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn btn-primary" onClick={handleChangePwd}><FiLock size={14} /> Update Password</button>
                <button className="btn btn-secondary" onClick={() => { setPwdForm({ current: '', newPwd: '', confirm: '' }); setPwdErrors({}); }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {tab === 'Notifications' && (
        <div style={{ maxWidth: 600 }}>
          {[
            { title: 'Shipment Alerts', icon: FiBell, items: [
              { key: 'newShipment', label: 'New Shipment Booked', desc: 'Get notified when a new shipment is created' },
              { key: 'deliveryConfirm', label: 'Delivery Confirmation', desc: 'Alert when a shipment is marked as delivered' },
            ]},
            { title: 'Financial Alerts', icon: FiBell, items: [
              { key: 'paymentReceived', label: 'Payment Received', desc: 'Notify when a payment is confirmed' },
            ]},
            { title: 'Staff Alerts', icon: FiBell, items: [
              { key: 'staffLeave', label: 'Staff Leave Requests', desc: 'Notify when staff submits a leave request' },
            ]},
            { title: 'Report Alerts', icon: FiBell, items: [
              { key: 'dailyReport', label: 'Daily Summary Report', desc: 'Receive daily operations summary at 9 PM' },
              { key: 'weeklyReport', label: 'Weekly Analytics Report', desc: 'Receive weekly performance report every Monday' },
            ]},
            { title: 'Channels', icon: FiBell, items: [
              { key: 'smsAlerts', label: 'SMS Notifications', desc: 'Send alerts via SMS to registered mobile number' },
              { key: 'emailAlerts', label: 'Email Notifications', desc: 'Send alerts to admin@milogistics.com' },
            ]},
          ].map(section => (
            <div key={section.title} className="settings-card mb-4">
              <div className="settings-card-header">
                <section.icon color="var(--brand-accent)" size={16} />
                <h3>{section.title}</h3>
              </div>
              <div className="settings-card-body" style={{ padding: '0 20px' }}>
                {section.items.map(item => <ToggleRow key={item.key} label={item.label} desc={item.desc} stateKey={item.key} />)}
              </div>
            </div>
          ))}
          <button className="btn btn-primary" onClick={() => toast.success('Notification preferences saved!')}><FiSave size={14} /> Save Preferences</button>
        </div>
      )}

      {/* Theme */}
      {tab === 'Theme' && (
        <div style={{ maxWidth: 560 }}>
          <div className="settings-card mb-4">
            <div className="settings-card-header"><FiMonitor color="var(--brand-accent)" size={16} /><h3>Appearance</h3></div>
            <div className="settings-card-body">
              <div className="setting-row">
                <div className="setting-row-info">
                  <div className="setting-row-label">Dark Mode</div>
                  <div className="setting-row-desc">Switch between light and dark interface</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Accent Color</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {accentColors.map(c => (
                    <div
                      key={c.val}
                      className={`color-swatch ${selectedColor === c.val ? 'selected' : ''}`}
                      style={{ background: c.val }}
                      title={c.name}
                      onClick={() => { setSelectedColor(c.val); toast.success(`${c.name} theme applied!`); }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Font Size</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Small', 'Medium', 'Large'].map(size => (
                    <button key={size} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>{size}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => toast.success('Theme preferences saved!')}><FiSave size={14} /> Save Theme</button>
        </div>
      )}
    </div>
  );
}
