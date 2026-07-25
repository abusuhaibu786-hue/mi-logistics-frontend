import { useEffect } from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';
import { getStatusBadge, getStatusLabel, getInitials, getAvatarColor } from '../../utils/helpers';

/* ─── Modal ──────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, size = '', footer }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${size}`}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

/* ─── Confirm Dialog ─────────────────────────────────────────── */
export function ConfirmDialog({ open, onClose, onConfirm, title, message, danger }) {
  return (
    <Modal open={open} onClose={onClose} title="" size="confirm-dialog">
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div className={`confirm-icon`} style={{ background: danger ? '#FEE2E2' : '#FEF3C7', color: danger ? 'var(--brand-danger)' : 'var(--brand-warning)' }}>
          <FiAlertTriangle size={22} />
        </div>
        <h3 style={{ marginBottom: 8 }}>{title || 'Are you sure?'}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-warning'}`} onClick={() => { onConfirm(); onClose(); }}>
            {danger ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Status Badge ───────────────────────────────────────────── */
export function StatusBadge({ status }) {
  return (
    <span className={`badge ${getStatusBadge(status)}`}>
      <span className="status-dot" style={{
        background: status === 'delivered' || status === 'active' ? 'var(--brand-success)' :
                    status === 'in-transit' ? 'var(--brand-info)' :
                    status === 'pending' || status === 'on-leave' ? 'var(--brand-warning)' : 'var(--brand-danger)'
      }} />
      {getStatusLabel(status)}
    </span>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────── */
export function Avatar({ name, size = 'md', style = {} }) {
  return (
    <div
      className={`avatar avatar-${size}`}
      style={{ background: getAvatarColor(name), color: '#fff', ...style }}
    >
      {getInitials(name)}
    </div>
  );
}

/* ─── Skeleton Loading ───────────────────────────────────────── */
export function SkeletonCard() {
  return (
    <div className="card card-body">
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton" style={{ width: 52, height: 52, borderRadius: '12px' }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-text sm" style={{ width: '60%' }} />
          <div className="skeleton" style={{ height: 28, width: '40%', marginTop: 8 }} />
        </div>
      </div>
      <div className="skeleton skeleton-text" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div style={{ padding: '16px' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3" style={{ marginBottom: 14 }}>
          <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-text" style={{ width: '50%' }} />
            <div className="skeleton skeleton-text sm" style={{ width: '35%' }} />
          </div>
          <div className="skeleton" style={{ width: 80, height: 24, borderRadius: 20 }} />
        </div>
      ))}
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────── */
export function StatCard({ label, value, change, changeType = 'up', icon: Icon, accent, iconBg, iconColor }) {
  return (
    <div className={`stat-card ${accent || ''}`}>
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className={`stat-change ${changeType}`}>{change}</div>
      </div>
      <div className="stat-icon-wrap" style={{ background: iconBg }}>
        <Icon size={24} color={iconColor} />
      </div>
    </div>
  );
}

/* ─── Empty State ────────────────────────────────────────────── */
export function EmptyState({ icon = '📦', title, desc, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}

/* ─── Pagination ─────────────────────────────────────────────── */
export function Pagination({ page, perPage, total, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div className="pagination">
      <span className="pagination-info">Showing {start}–{end} of {total}</span>
      <div className="pagination-controls">
        <button className="page-btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>‹</button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
          <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => onChange(p)}>{p}</button>
        ))}
        <button className="page-btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>›</button>
      </div>
    </div>
  );
}

/* ─── Tab List ───────────────────────────────────────────────── */
export function TabList({ tabs, active, onChange }) {
  return (
    <div className="tab-list">
      {tabs.map(tab => (
        <button key={tab} className={`tab-item ${active === tab ? 'active' : ''}`} onClick={() => onChange(tab)}>
          {tab}
        </button>
      ))}
    </div>
  );
}
