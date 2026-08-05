import { useState, useMemo } from 'react';
import { FiPlus, FiSearch, FiEye, FiEdit2, FiTrash2, FiDownload, FiPackage, FiFilter } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { Modal, ConfirmDialog, StatusBadge, EmptyState, Pagination } from '../../components/common/UIComponents';
import { formatCurrency, formatDate, getPriorityBadge } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUSES = ['All', 'pending', 'in-transit', 'delivered', 'cancelled'];
const PRIORITIES = ['standard', 'express', 'economy'];

const emptyForm = { customer: '', phone: '', origin: 'Virudhunagar', destination: '', weight: '', amount: '', status: 'pending', priority: 'standard', staff: '', address: '' };

<<<<<<< HEAD
function ShipmentForm({ form, setF, formErrors, staffList }) {
  return (
    <div>
      <div className="grid grid-2">
        <div className="form-group">
          <label className="form-label">Customer Name <span className="required">*</span></label>
          <input className="form-control" placeholder="Enter customer name" value={form.customer} onChange={e => setF('customer', e.target.value)} style={{ borderColor: formErrors.customer ? 'var(--brand-danger)' : undefined }} />
          {formErrors.customer && <p className="form-error">{formErrors.customer}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-control" placeholder="+91 9876543210" value={form.phone} onChange={e => setF('phone', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Origin</label>
          <input className="form-control" value={form.origin} onChange={e => setF('origin', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Destination <span className="required">*</span></label>
          <input className="form-control" placeholder="City, State" value={form.destination} onChange={e => setF('destination', e.target.value)} style={{ borderColor: formErrors.destination ? 'var(--brand-danger)' : undefined }} />
          {formErrors.destination && <p className="form-error">{formErrors.destination}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Weight (kg) <span className="required">*</span></label>
          <input className="form-control" type="number" placeholder="0.0" value={form.weight} onChange={e => setF('weight', e.target.value)} style={{ borderColor: formErrors.weight ? 'var(--brand-danger)' : undefined }} />
          {formErrors.weight && <p className="form-error">{formErrors.weight}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Amount (₹) <span className="required">*</span></label>
          <input className="form-control" type="number" placeholder="0" value={form.amount} onChange={e => setF('amount', e.target.value)} style={{ borderColor: formErrors.amount ? 'var(--brand-danger)' : undefined }} />
          {formErrors.amount && <p className="form-error">{formErrors.amount}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select className="form-control filter-select" value={form.priority} onChange={e => setF('priority', e.target.value)}>
            {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-control filter-select" value={form.status} onChange={e => setF('status', e.target.value)}>
            {STATUSES.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Delivery Address</label>
        <input className="form-control" placeholder="Full delivery address" value={form.address} onChange={e => setF('address', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Assigned Staff</label>
        <select className="form-control filter-select" value={form.staff} onChange={e => setF('staff', e.target.value)}>
          <option value="">Select staff member</option>
          {staffList.map(st => <option key={st.id} value={st.name}>{st.name}</option>)}
        </select>
      </div>
    </div>
  );
}
=======
const ShipmentForm = ({ form, formErrors, setF, staffList }) => (
  <div>
    <div className="grid grid-2">
      <div className="form-group">
        <label className="form-label">Customer Name <span className="required">*</span></label>
        <input className="form-control" placeholder="Enter customer name" value={form.customer} onChange={e => setF('customer', e.target.value)} style={{ borderColor: formErrors.customer ? 'var(--brand-danger)' : undefined }} />
        {formErrors.customer && <p className="form-error">{formErrors.customer}</p>}
      </div>
      <div className="form-group">
        <label className="form-label">Phone</label>
        <input className="form-control" placeholder="+91 9876543210" value={form.phone} onChange={e => setF('phone', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Origin</label>
        <input className="form-control" value={form.origin} onChange={e => setF('origin', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Destination <span className="required">*</span></label>
        <input className="form-control" placeholder="City, State" value={form.destination} onChange={e => setF('destination', e.target.value)} style={{ borderColor: formErrors.destination ? 'var(--brand-danger)' : undefined }} />
        {formErrors.destination && <p className="form-error">{formErrors.destination}</p>}
      </div>
      <div className="form-group">
        <label className="form-label">Weight (kg) <span className="required">*</span></label>
        <input className="form-control" type="number" placeholder="0.0" value={form.weight} onChange={e => setF('weight', e.target.value)} style={{ borderColor: formErrors.weight ? 'var(--brand-danger)' : undefined }} />
        {formErrors.weight && <p className="form-error">{formErrors.weight}</p>}
      </div>
      <div className="form-group">
        <label className="form-label">Amount (₹) <span className="required">*</span></label>
        <input className="form-control" type="number" placeholder="0" value={form.amount} onChange={e => setF('amount', e.target.value)} style={{ borderColor: formErrors.amount ? 'var(--brand-danger)' : undefined }} />
        {formErrors.amount && <p className="form-error">{formErrors.amount}</p>}
      </div>
      <div className="form-group">
        <label className="form-label">Priority</label>
        <select className="form-control filter-select" value={form.priority} onChange={e => setF('priority', e.target.value)}>
          {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select className="form-control filter-select" value={form.status} onChange={e => setF('status', e.target.value)}>
          {STATUSES.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
    </div>
    <div className="form-group">
      <label className="form-label">Delivery Address</label>
      <input className="form-control" placeholder="Full delivery address" value={form.address} onChange={e => setF('address', e.target.value)} />
    </div>
    <div className="form-group">
      <label className="form-label">Assigned Staff</label>
      <select className="form-control filter-select" value={form.staff} onChange={e => setF('staff', e.target.value)}>
        <option value="">Select staff member</option>
        {staffList.map(st => <option key={st.id} value={st.name}>{st.name}</option>)}
      </select>
    </div>
  </div>
);
>>>>>>> c6a602bbfa465cb979efa3f0b319ac627d4fd7c4

export default function Shipments() {
  const { shipments, addShipment, updateShipment, deleteShipment, customers, staff: staffList } = useApp();
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

  const filtered = useMemo(() => {
    return shipments.filter(s => {
      const matchSearch = !search || s.trackingNumber.toLowerCase().includes(search.toLowerCase()) || s.customer.toLowerCase().includes(search.toLowerCase()) || s.destination.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [shipments, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const validateForm = () => {
    const e = {};
    if (!form.customer) e.customer = 'Customer name is required';
    if (!form.destination) e.destination = 'Destination is required';
    if (!form.weight) e.weight = 'Weight is required';
    if (!form.amount) e.amount = 'Amount is required';
    return e;
  };

<<<<<<< HEAD
  const handleAdd = () => {
    const e = validateForm();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    addShipment(form);
=======
  const handleAdd = async () => {
    const e = validateForm();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    const ok = await addShipment(form);
    if (!ok) return;
>>>>>>> c6a602bbfa465cb979efa3f0b319ac627d4fd7c4
    toast.success('Shipment created successfully!');
    setShowAdd(false);
    setForm(emptyForm);
    setFormErrors({});
  };

<<<<<<< HEAD
  const handleEdit = () => {
    const e = validateForm();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    updateShipment(showEdit.id, form);
=======
  const handleEdit = async () => {
    const e = validateForm();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    const ok = await updateShipment(showEdit.id, form);
    if (!ok) return;
>>>>>>> c6a602bbfa465cb979efa3f0b319ac627d4fd7c4
    toast.success('Shipment updated!');
    setShowEdit(null);
    setForm(emptyForm);
    setFormErrors({});
  };

  const openEdit = (s) => { setShowEdit(s); setForm({ ...s }); setFormErrors({}); };
  const setF = (k, v) => { setForm(f => ({ ...f, [k]: v })); setFormErrors(e => ({ ...e, [k]: '' })); };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Shipments</h1>
          <p>{shipments.length} total shipments · {shipments.filter(s => s.status === 'in-transit').length} in transit</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><FiDownload size={14} /> Export</button>
          <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setFormErrors({}); setShowAdd(true); }}>
            <FiPlus size={15} /> Add Shipment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-input">
          <FiSearch className="search-icon" size={15} />
          <input className="form-control" placeholder="Search by tracking number, customer, destination..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter size={14} color="var(--text-muted)" />
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className="btn btn-sm"
              style={{ background: statusFilter === s ? 'var(--brand-accent)' : 'var(--bg-surface-2)', color: statusFilter === s ? '#fff' : 'var(--text-secondary)', border: '1px solid', borderColor: statusFilter === s ? 'var(--brand-accent)' : 'var(--border-color)' }}>
              {s === 'All' ? 'All' : s === 'in-transit' ? 'In Transit' : s.charAt(0).toUpperCase() + s.slice(1)}
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
                <th>Tracking No.</th>
                <th>Customer</th>
                <th>Origin → Destination</th>
                <th>Weight</th>
                <th>Priority</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9}><EmptyState icon="📦" title="No shipments found" desc="Try adjusting your search or filters" /></td></tr>
              ) : paginated.map(s => (
                <tr key={s.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--brand-accent)', fontWeight: 600 }}>{s.trackingNumber}</span></td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{s.customer}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.phone}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}><span style={{ color: 'var(--text-muted)' }}>{s.origin}</span> → <strong>{s.destination}</strong></div>
                  </td>
                  <td><span style={{ fontSize: 13 }}>{s.weight}</span></td>
                  <td><span className={`badge ${getPriorityBadge(s.priority)}`}>{s.priority}</span></td>
                  <td><span style={{ fontWeight: 600 }}>{formatCurrency(s.amount)}</span></td>
                  <td><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(s.date)}</span></td>
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
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Shipment" size="modal-lg"
        footer={<><button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAdd}><FiPackage size={14} /> Create Shipment</button></>}>
<<<<<<< HEAD
        <ShipmentForm form={form} setF={setF} formErrors={formErrors} staffList={staffList} />
=======
        <ShipmentForm form={form} formErrors={formErrors} setF={setF} staffList={staffList} />
>>>>>>> c6a602bbfa465cb979efa3f0b319ac627d4fd7c4
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!showEdit} onClose={() => setShowEdit(null)} title="Edit Shipment" size="modal-lg"
        footer={<><button className="btn btn-secondary" onClick={() => setShowEdit(null)}>Cancel</button><button className="btn btn-primary" onClick={handleEdit}>Save Changes</button></>}>
<<<<<<< HEAD
        <ShipmentForm form={form} setF={setF} formErrors={formErrors} staffList={staffList} />
=======
        <ShipmentForm form={form} formErrors={formErrors} setF={setF} staffList={staffList} />
>>>>>>> c6a602bbfa465cb979efa3f0b319ac627d4fd7c4
      </Modal>

      {/* View Modal */}
      <Modal open={!!showView} onClose={() => setShowView(null)} title="Shipment Details" size="modal-lg">
        {showView && (
          <div>
            <div style={{ background: 'var(--bg-surface-2)', borderRadius: 10, padding: 20, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Tracking Number</p>
                <p style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: 'var(--brand-accent)' }}>{showView.trackingNumber}</p>
              </div>
              <StatusBadge status={showView.status} />
            </div>
            <div className="grid grid-2">
              {[
                ['Customer', showView.customer], ['Phone', showView.phone || '—'],
                ['Origin', showView.origin], ['Destination', showView.destination],
                ['Weight', showView.weight], ['Amount', formatCurrency(showView.amount)],
                ['Priority', showView.priority], ['Assigned Staff', showView.staff || '—'],
                ['Booking Date', formatDate(showView.date)], ['Delivered On', formatDate(showView.deliveredDate)],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k}</p>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>
            {showView.address && (
              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery Address</p>
                <p style={{ fontSize: 14 }}>{showView.address}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog open={!!showDelete} onClose={() => setShowDelete(null)} danger
        title="Delete Shipment?"
        message={`This will permanently delete shipment ${showDelete?.trackingNumber}. This action cannot be undone.`}
        onConfirm={() => { deleteShipment(showDelete.id); toast.success('Shipment deleted'); }} />
    </div>
  );
}
