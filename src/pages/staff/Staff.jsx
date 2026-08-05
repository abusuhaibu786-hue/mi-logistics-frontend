import { useState, useMemo } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiMail, FiPhone, FiStar, FiTruck, FiDownload } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { Modal, ConfirmDialog, StatusBadge, Avatar, EmptyState, Pagination } from '../../components/common/UIComponents';
import { formatDate, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ROLES = ['Delivery Manager', 'Senior Driver', 'Driver', 'Warehouse Staff', 'Customer Service', 'Accountant'];
const DEPTS = ['Operations', 'Delivery', 'Warehouse', 'Support', 'Finance'];
const emptyForm = { name: '', email: '', phone: '', role: 'Driver', department: 'Delivery', salary: '', address: '', status: 'active' };

function StaffForm({ form, setF, formErrors }) {
  return (
    <div>
      <div className="grid grid-2">
        <div className="form-group">
          <label className="form-label">Full Name <span className="required">*</span></label>
          <input className="form-control" placeholder="e.g. Ramesh Kumar" value={form.name} onChange={e => setF('name', e.target.value)} style={{ borderColor: formErrors.name ? 'var(--brand-danger)' : undefined }} />
          {formErrors.name && <p className="form-error">{formErrors.name}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Phone <span className="required">*</span></label>
          <input className="form-control" placeholder="+91 9876543210" value={form.phone} onChange={e => setF('phone', e.target.value)} style={{ borderColor: formErrors.phone ? 'var(--brand-danger)' : undefined }} />
          {formErrors.phone && <p className="form-error">{formErrors.phone}</p>}
        </div>
        <div className="form-group col-span-2">
          <label className="form-label">Email <span className="required">*</span></label>
          <input className="form-control" type="email" placeholder="staff@milogistics.com" value={form.email} onChange={e => setF('email', e.target.value)} style={{ borderColor: formErrors.email ? 'var(--brand-danger)' : undefined }} />
          {formErrors.email && <p className="form-error">{formErrors.email}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <select className="form-control filter-select" value={form.role} onChange={e => setF('role', e.target.value)}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Department</label>
          <select className="form-control filter-select" value={form.department} onChange={e => setF('department', e.target.value)}>
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Monthly Salary (₹) <span className="required">*</span></label>
          <input className="form-control" type="number" placeholder="25000" value={form.salary} onChange={e => setF('salary', e.target.value)} style={{ borderColor: formErrors.salary ? 'var(--brand-danger)' : undefined }} />
          {formErrors.salary && <p className="form-error">{formErrors.salary}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-control filter-select" value={form.status} onChange={e => setF('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="form-group col-span-2">
          <label className="form-label">Address</label>
          <input className="form-control" placeholder="Virudhunagar" value={form.address} onChange={e => setF('address', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

export default function Staff() {
  const { staff, addStaff, updateStaff, deleteStaff } = useApp();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [showView, setShowView] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const PER_PAGE = 8;

  const departments = ['All', ...new Set(staff.map(s => s.department))];

  const filtered = useMemo(() =>
    staff.filter(s => {
      const matchSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'All' || s.department === deptFilter;
      return matchSearch && matchDept;
    }), [staff, search, deptFilter]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone) e.phone = 'Phone is required';
    if (!form.salary) e.salary = 'Salary is required';
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    addStaff(form);
    toast.success('Staff member added!');
    setShowAdd(false); setForm(emptyForm); setFormErrors({});
  };

  const handleEdit = () => {
    const e = validate();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    updateStaff(showEdit.id, form);
    toast.success('Staff record updated!');
    setShowEdit(null); setForm(emptyForm); setFormErrors({});
  };

  const openEdit = (s) => { setShowEdit(s); setForm({ ...s }); setFormErrors({}); };
  const setF = (k, v) => { setForm(f => ({ ...f, [k]: v })); setFormErrors(e => ({ ...e, [k]: '' })); };

  const RatingStars = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <FiStar key={i} size={12} fill={i <= Math.round(rating) ? '#F59E0B' : 'none'} color={i <= Math.round(rating) ? '#F59E0B' : 'var(--border-color)'} />
      ))}
      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 2 }}>{rating}</span>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Staff Management</h1>
          <p>{staff.length} total staff · {staff.filter(s => s.status === 'active').length} active</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><FiDownload size={14} /> Export</button>
          <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setFormErrors({}); setShowAdd(true); }}>
            <FiPlus size={15} /> Add Staff
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-4 mb-6">
        {[
          { label: 'Total Staff', val: staff.length, color: 'var(--brand-info)', bg: 'rgba(59,130,246,0.1)' },
          { label: 'Active', val: staff.filter(s => s.status === 'active').length, color: 'var(--brand-success)', bg: 'rgba(16,185,129,0.1)' },
          { label: 'On Leave', val: staff.filter(s => s.status === 'on-leave').length, color: 'var(--brand-warning)', bg: 'rgba(245,158,11,0.1)' },
          { label: 'Total Deliveries', val: staff.reduce((sum, s) => sum + (s.deliveries || 0), 0), color: 'var(--brand-accent)', bg: 'rgba(249,115,22,0.1)' },
        ].map(c => (
          <div key={c.label} className="card">
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiTruck size={20} color={c.color} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk'" }}>{c.val}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-input">
          <FiSearch className="search-icon" size={15} />
          <input className="form-control" placeholder="Search staff by name, role, or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="flex items-center gap-2">
          {departments.map(d => (
            <button key={d} onClick={() => { setDeptFilter(d); setPage(1); }} className="btn btn-sm"
              style={{ background: deptFilter === d ? 'var(--brand-accent)' : 'var(--bg-surface-2)', color: deptFilter === d ? '#fff' : 'var(--text-secondary)', border: '1px solid', borderColor: deptFilter === d ? 'var(--brand-accent)' : 'var(--border-color)' }}>
              {d}
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
                <th>Staff Member</th>
                <th>Contact</th>
                <th>Role / Dept.</th>
                <th>Deliveries</th>
                <th>Rating</th>
                <th>Salary</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9}><EmptyState icon="👤" title="No staff found" desc="Try adjusting your search or department filter" /></td></tr>
              ) : paginated.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size="sm" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}><FiMail size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />{s.email}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}><FiPhone size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />{s.phone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{s.role}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.department}</div>
                  </td>
                  <td><span className="badge badge-info">{s.deliveries}</span></td>
                  <td><RatingStars rating={s.rating} /></td>
                  <td><span style={{ fontWeight: 600 }}>{formatCurrency(s.salary)}/mo</span></td>
                  <td><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(s.joinDate)}</span></td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="btn btn-icon btn-secondary btn-icon-sm" title="View" onClick={() => setShowView(s)}><FiEye size={14} /></button>
                      <button className="btn btn-icon btn-secondary btn-icon-sm" title="Edit" onClick={() => openEdit(s)}><FiEdit2 size={14} /></button>
                      <button className="btn btn-icon btn-icon-sm" title="Delete" onClick={() => setShowDelete(s)} style={{ background: '#FEE2E2', color: 'var(--brand-danger)' }}><FiTrash2 size={14} /></button>
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
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Staff Member" size="modal-lg"
        footer={<><button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAdd}><FiPlus size={14} /> Add Staff</button></>}>
        <StaffForm form={form} setF={setF} formErrors={formErrors} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!showEdit} onClose={() => setShowEdit(null)} title="Edit Staff Member" size="modal-lg"
        footer={<><button className="btn btn-secondary" onClick={() => setShowEdit(null)}>Cancel</button><button className="btn btn-primary" onClick={handleEdit}>Save Changes</button></>}>
        <StaffForm form={form} setF={setF} formErrors={formErrors} />
      </Modal>

      {/* View Modal */}
      <Modal open={!!showView} onClose={() => setShowView(null)} title="Staff Profile">
        {showView && (
          <div>
            <div style={{ textAlign: 'center', padding: '20px 0 28px', borderBottom: '1px solid var(--border-color)', marginBottom: 24 }}>
              <Avatar name={showView.name} size="xl" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ marginBottom: 4 }}>{showView.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{showView.role} · {showView.department}</p>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 6 }}>
                <StatusBadge status={showView.status} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 36, marginTop: 20 }}>
                {[['Deliveries', showView.deliveries], ['Rating', `${showView.rating} ⭐`], ['Salary', formatCurrency(showView.salary)]].map(([k, v]) => (
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
                ['Address', showView.address], ['Join Date', formatDate(showView.joinDate)],
                ['Staff ID', showView.id], ['Status', showView.status],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{k}</p>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog open={!!showDelete} onClose={() => setShowDelete(null)} danger
        title="Remove Staff Member?"
        message={`This will permanently remove ${showDelete?.name} from the system. This action cannot be undone.`}
        onConfirm={() => { deleteStaff(showDelete.id); toast.success('Staff member removed'); }} />
    </div>
  );
}
