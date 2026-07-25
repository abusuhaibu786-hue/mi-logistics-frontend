import { useState, useMemo } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiMail, FiPhone, FiMapPin, FiPackage, FiDownload } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { Modal, ConfirmDialog, StatusBadge, Avatar, EmptyState, Pagination } from '../../components/common/UIComponents';
import { formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const emptyForm = { name: '', email: '', phone: '', city: '', state: 'Tamil Nadu', status: 'active' };

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, shipments } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [showView, setShowView] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const PER_PAGE = 8;

  const filtered = useMemo(() =>
    customers.filter(c => {
      const matchSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchSearch && matchStatus;
    }), [customers, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone) e.phone = 'Phone is required';
    if (!form.city) e.city = 'City is required';
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    addCustomer(form);
    toast.success('Customer added successfully!');
    setShowAdd(false); setForm(emptyForm); setFormErrors({});
  };

  const handleEdit = () => {
    const e = validate();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    updateCustomer(showEdit.id, form);
    toast.success('Customer updated!');
    setShowEdit(null); setForm(emptyForm); setFormErrors({});
  };

  const openEdit = (c) => { setShowEdit(c); setForm({ ...c }); setFormErrors({}); };
  const setF = (k, v) => { setForm(f => ({ ...f, [k]: v })); setFormErrors(e => ({ ...e, [k]: '' })); };

  const CustomerForm = () => (
    <div>
      <div className="grid grid-2">
        <div className="form-group">
          <label className="form-label">Full Name <span className="required">*</span></label>
          <input className="form-control" placeholder="e.g. Arjun Sharma" value={form.name} onChange={e => setF('name', e.target.value)} style={{ borderColor: formErrors.name ? 'var(--brand-danger)' : undefined }} />
          {formErrors.name && <p className="form-error">{formErrors.name}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Phone <span className="required">*</span></label>
          <input className="form-control" placeholder="+91 9876543210" value={form.phone} onChange={e => setF('phone', e.target.value)} style={{ borderColor: formErrors.phone ? 'var(--brand-danger)' : undefined }} />
          {formErrors.phone && <p className="form-error">{formErrors.phone}</p>}
        </div>
        <div className="form-group col-span-2">
          <label className="form-label">Email Address <span className="required">*</span></label>
          <input className="form-control" type="email" placeholder="customer@example.com" value={form.email} onChange={e => setF('email', e.target.value)} style={{ borderColor: formErrors.email ? 'var(--brand-danger)' : undefined }} />
          {formErrors.email && <p className="form-error">{formErrors.email}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">City <span className="required">*</span></label>
          <input className="form-control" placeholder="Chennai" value={form.city} onChange={e => setF('city', e.target.value)} style={{ borderColor: formErrors.city ? 'var(--brand-danger)' : undefined }} />
          {formErrors.city && <p className="form-error">{formErrors.city}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">State</label>
          <select className="form-control filter-select" value={form.state} onChange={e => setF('state', e.target.value)}>
            {['Tamil Nadu','Karnataka','Maharashtra','Delhi','Telangana','Kerala','Andhra Pradesh'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-control filter-select" value={form.status} onChange={e => setF('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Customers</h1>
          <p>{customers.length} total customers · {customers.filter(c => c.status === 'active').length} active</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><FiDownload size={14} /> Export</button>
          <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setFormErrors({}); setShowAdd(true); }}>
            <FiPlus size={15} /> Add Customer
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-4 mb-6">
        {[
          { label: 'Total Customers', value: customers.length, color: 'var(--brand-info)', bg: 'rgba(59,130,246,0.1)' },
          { label: 'Active Customers', value: customers.filter(c => c.status === 'active').length, color: 'var(--brand-success)', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Total Revenue', value: formatCurrency(customers.reduce((s, c) => s + (c.totalSpent || 0), 0)), color: 'var(--brand-accent)', bg: 'rgba(249,115,22,0.1)' },
          { label: 'Avg. Shipments', value: Math.round(customers.reduce((s, c) => s + (c.totalShipments || 0), 0) / customers.length), color: 'var(--brand-warning)', bg: 'rgba(245,158,11,0.1)' },
        ].map(card => (
          <div key={card.label} className="card">
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiPackage size={20} color={card.color} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk'", color: 'var(--text-primary)' }}>{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-input">
          <FiSearch className="search-icon" size={15} />
          <input className="form-control" placeholder="Search by name, email or city..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="flex items-center gap-2">
          {['All', 'active', 'inactive'].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className="btn btn-sm"
              style={{ background: statusFilter === s ? 'var(--brand-accent)' : 'var(--bg-surface-2)', color: statusFilter === s ? '#fff' : 'var(--text-secondary)', border: '1px solid', borderColor: statusFilter === s ? 'var(--brand-accent)' : 'var(--border-color)' }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Shipments</th>
                <th>Total Spent</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8}><EmptyState icon="👥" title="No customers found" desc="Try adjusting your search or filters" /></td></tr>
              ) : paginated.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} size="sm" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}><FiMail size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />{c.email}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}><FiPhone size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />{c.phone}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1" style={{ fontSize: 13 }}>
                      <FiMapPin size={12} color="var(--text-muted)" />{c.city}, {c.state}
                    </div>
                  </td>
                  <td><span className="badge badge-info">{c.totalShipments} orders</span></td>
                  <td><span style={{ fontWeight: 600 }}>{formatCurrency(c.totalSpent)}</span></td>
                  <td><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(c.joinDate)}</span></td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="btn btn-icon btn-secondary btn-icon-sm" title="View" onClick={() => setShowView(c)}><FiEye size={14} /></button>
                      <button className="btn btn-icon btn-secondary btn-icon-sm" title="Edit" onClick={() => openEdit(c)}><FiEdit2 size={14} /></button>
                      <button className="btn btn-icon btn-icon-sm" title="Delete" onClick={() => setShowDelete(c)} style={{ background: '#FEE2E2', color: 'var(--brand-danger)' }}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > PER_PAGE && <Pagination page={page} perPage={PER_PAGE} total={filtered.length} onChange={setPage} />}
      </div>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Customer" size="modal-lg"
        footer={<><button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAdd}><FiPlus size={14} /> Add Customer</button></>}>
        <CustomerForm />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!showEdit} onClose={() => setShowEdit(null)} title="Edit Customer" size="modal-lg"
        footer={<><button className="btn btn-secondary" onClick={() => setShowEdit(null)}>Cancel</button><button className="btn btn-primary" onClick={handleEdit}>Save Changes</button></>}>
        <CustomerForm />
      </Modal>

      {/* View Modal */}
      <Modal open={!!showView} onClose={() => setShowView(null)} title="Customer Profile" size="modal-lg">
        {showView && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '20px', background: 'var(--bg-surface-2)', borderRadius: 12 }}>
              <Avatar name={showView.name} size="lg" />
              <div>
                <h3 style={{ marginBottom: 2 }}>{showView.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{showView.id}</p>
                <div style={{ marginTop: 8 }}><StatusBadge status={showView.status} /></div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 28 }}>
                {[['Shipments', showView.totalShipments], ['Total Spent', formatCurrency(showView.totalSpent)]].map(([k, v]) => (
                  <div key={k} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk'" }}>{v}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-2">
              {[
                ['Email', showView.email], ['Phone', showView.phone],
                ['City', showView.city], ['State', showView.state],
                ['Joined', formatDate(showView.joinDate)], ['Status', showView.status.charAt(0).toUpperCase() + showView.status.slice(1)],
              ].map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{k}</p>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Recent Shipments</p>
              {shipments.filter(s => s.customerId === showView.id).slice(0, 3).map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-surface-2)', borderRadius: 8, marginBottom: 8 }}>
                  <div>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--brand-accent)', fontWeight: 600 }}>{s.trackingNumber}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 10 }}>→ {s.destination}</span>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))}
              {shipments.filter(s => s.customerId === showView.id).length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No shipments found for this customer.</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog open={!!showDelete} onClose={() => setShowDelete(null)} danger
        title="Delete Customer?"
        message={`This will permanently delete ${showDelete?.name}'s account and all associated data.`}
        onConfirm={() => { deleteCustomer(showDelete.id); toast.success('Customer deleted'); }} />
    </div>
  );
}
