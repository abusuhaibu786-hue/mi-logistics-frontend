export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const getStatusBadge = (status) => {
  const map = {
    delivered: 'badge-success',
    'in-transit': 'badge-info',
    pending: 'badge-warning',
    cancelled: 'badge-danger',
    active: 'badge-success',
    inactive: 'badge-secondary',
    'on-leave': 'badge-warning',
  };
  return map[status] || 'badge-secondary';
};

export const getStatusLabel = (status) => {
  const map = {
    'in-transit': 'In Transit',
    delivered: 'Delivered',
    pending: 'Pending',
    cancelled: 'Cancelled',
    active: 'Active',
    inactive: 'Inactive',
    'on-leave': 'On Leave',
  };
  return map[status] || status;
};

export const getPriorityBadge = (priority) => {
  const map = { express: 'badge-orange', standard: 'badge-info', economy: 'badge-secondary' };
  return map[priority] || 'badge-secondary';
};

export const getInitials = (name) =>
  name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';

export const getAvatarColor = (name) => {
  const colors = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#F97316'];
  let hash = 0;
  for (let c of (name || '')) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export const debounce = (fn, delay) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};

export const generateTrackingNumber = () =>
  `MIL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;
