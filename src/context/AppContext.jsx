import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  shipmentService, customerService, staffService,
  notificationService, dashboardService,
} from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

// Flattens DRF's { count, next, previous, results } pagination envelope
// down to a plain array — every page expects shipments/customers/staff
// to just be arrays, so the pagination wrapper is handled here once
// rather than in every consumer.
const unwrapList = (data) => Array.isArray(data) ? data : (data?.results ?? []);

// DRF serializes DecimalField as a string (e.g. "750.00") to avoid float
// precision loss in transit. That's correct for display via
// formatCurrency, but breaks any .reduce()/sum across records — "0" +
// "750.00" + "320.00" concatenates instead of adding. Coercing the known
// numeric-but-string fields to real numbers here means every page gets
// real numbers, instead of patching each summing call site individually.
const toNumericFields = (record, fields) => {
  const copy = { ...record };
  fields.forEach(f => { if (copy[f] != null) copy[f] = Number(copy[f]); });
  return copy;
};
const normalizeShipment = (s) => toNumericFields(s, ['amount']);
const normalizeCustomer = (c) => toNumericFields(c, ['totalSpent', 'totalShipments']);
const normalizeStaffMember = (s) => toNumericFields(s, ['salary', 'rating', 'deliveries']);

export const AppProvider = ({ children }) => {
  const { isAuth } = useAuth();

  const [theme, setTheme] = useState(() => localStorage.getItem('mi-theme') || 'light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Arrays start empty (not undefined) so pages that call .filter()/.map()
  // on first render don't need extra null-guards — they just render an
  // empty list until the real data arrives.
  const [shipments, setShipments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, delivered: 0, pending: 0, inTransit: 0, revenue: 0 });
  const [monthlyStats, setMonthlyStats] = useState({ labels: [], revenue: [], shipments: [], delivered: [] });
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mi-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const refreshAll = useCallback(async () => {
    setDataLoading(true);
    try {
      const [shipmentsRes, customersRes, staffRes, notifsRes, statsRes, monthlyRes] = await Promise.all([
        shipmentService.getAll({ page_size: 100 }),
        customerService.getAll({ page_size: 100 }),
        staffService.getAll({ page_size: 100 }),
        notificationService.getAll(),
        dashboardService.getStats(),
        dashboardService.getMonthly(),
      ]);
      setShipments(unwrapList(shipmentsRes.data).map(normalizeShipment));
      setCustomers(unwrapList(customersRes.data).map(normalizeCustomer));
      setStaff(unwrapList(staffRes.data).map(normalizeStaffMember));
      setNotifications(unwrapList(notifsRes.data).map(n => ({ ...n, read: n.is_read })));
      setStats({
        total: statsRes.data.totalShipments,
        delivered: statsRes.data.deliveredShipments,
        pending: statsRes.data.pendingShipments,
        inTransit: statsRes.data.inTransitShipments,
        revenue: Number(statsRes.data.totalRevenue) || 0,
      });
      setMonthlyStats(monthlyRes.data);
    } catch (err) {
      toast.error('Could not load data from the server.');
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Loads once the user is actually authenticated (token attached), and
  // clears back to empty state on logout so a second login doesn't
  // briefly flash the previous user's data.
  useEffect(() => {
    if (isAuth) {
      refreshAll();
    } else {
      setShipments([]); setCustomers([]); setStaff([]); setNotifications([]);
      setStats({ total: 0, delivered: 0, pending: 0, inTransit: 0, revenue: 0 });
      setMonthlyStats({ labels: [], revenue: [], shipments: [], delivered: [] });
    }
  }, [isAuth, refreshAll]);

  // --- Shipments -----------------------------------------------------
  // The Shipments page form collects free-text `customer` and `staff`
  // *names* (matching the original sample-data shape), but the API needs
  // `customerCode` / `staffCode`. Resolved here so the page component
  // doesn't need to know about the backend's id scheme.
<<<<<<< HEAD
  // `customerCodeOverride` lets addShipment supply the code of a customer
  // it just auto-created (before that customer exists in `customers`
  // state yet), while update/edit keeps resolving by name as before.
  const resolveShipmentPayload = (data, customerCodeOverride) => {
    const customer = customers.find(c => c.name === data.customer);
    const staffMember = staff.find(s => s.name === data.staff);
=======
  const resolveShipmentPayload = (data) => {
    const norm = (s) => (s || '').trim().toLowerCase();
    const customer = customers.find(c => norm(c.name) === norm(data.customer));
    const staffMember = staff.find(s => norm(s.name) === norm(data.staff));
>>>>>>> c6a602bbfa465cb979efa3f0b319ac627d4fd7c4
    return {
      customerCode: customerCodeOverride || customer?.id,
      staffCode: staffMember?.id,
      destination: data.destination,
      origin: data.origin,
      receiverName: data.customer,
      receiverPhone: data.phone,
      deliveryAddress: data.address,
      weightKg: parseFloat(data.weight) || 0,
      priority: data.priority,
      status: data.status,
      amount: parseFloat(data.amount) || 0,
    };
  };

  // If the typed customer name doesn't match an existing customer, a new
  // Customer record is created on the fly (name + phone from the form;
  // city/state fall back to defaults since the shipment form doesn't
  // collect them) so the shipment can still be booked without forcing
  // the user to go add the customer separately first.
  const addShipment = async (data) => {
    try {
<<<<<<< HEAD
      let customer = customers.find(c => c.name === data.customer);

      if (!customer) {
        try {
          const { data: newCustomer } = await customerService.create({
            name: data.customer,
            phone: data.phone || '',
            city: 'N/A',
          });
          customer = normalizeCustomer(newCustomer);
          setCustomers(prev => [customer, ...prev]);
        } catch (err) {
          toast.error(err.response?.data?.email?.[0] || err.response?.data?.name?.[0] || `Could not auto-create customer "${data.customer}".`);
          return;
        }
=======
      const payload = resolveShipmentPayload(data);
      if (!payload.customerCode) {
        toast.error(`No customer named "${data.customer}" found. Add them under Customers first.`);
        return false;
>>>>>>> c6a602bbfa465cb979efa3f0b319ac627d4fd7c4
      }

      const payload = resolveShipmentPayload(data, customer.id);
      const { data: created } = await shipmentService.create(payload);
      setShipments(prev => [normalizeShipment(created), ...prev]);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not create shipment.');
      return false;
    }
  };

  const updateShipment = async (id, data) => {
    const previous = shipments;
    setShipments(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    try {
      const payload = resolveShipmentPayload({ ...shipments.find(s => s.id === id), ...data });
      if (!payload.customerCode) {
        setShipments(previous);
        toast.error(`No customer named "${data.customer}" found. Add them under Customers first.`);
        return false;
      }
      const { data: updated } = await shipmentService.update(id, payload);
      setShipments(prev => prev.map(s => s.id === id ? normalizeShipment(updated) : s));
      return true;
    } catch (err) {
      setShipments(previous);
      toast.error('Could not update shipment.');
      return false;
    }
  };

  const deleteShipment = async (id) => {
    const previous = shipments;
    setShipments(prev => prev.filter(s => s.id !== id));
    try {
      await shipmentService.delete(id);
    } catch (err) {
      setShipments(previous);
      toast.error('Could not delete shipment.');
    }
  };

  // --- Customers -------------------------------------------------------
  const addCustomer = async (data) => {
    try {
      const { data: created } = await customerService.create(data);
      setCustomers(prev => [normalizeCustomer(created), ...prev]);
    } catch (err) {
      toast.error(err.response?.data?.email?.[0] || 'Could not create customer.');
    }
  };

  const updateCustomer = async (id, data) => {
    const previous = customers;
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    try {
      const { data: updated } = await customerService.update(id, data);
      setCustomers(prev => prev.map(c => c.id === id ? normalizeCustomer(updated) : c));
    } catch (err) {
      setCustomers(previous);
      toast.error('Could not update customer.');
    }
  };

  const deleteCustomer = async (id) => {
    const previous = customers;
    setCustomers(prev => prev.filter(c => c.id !== id));
    try {
      await customerService.delete(id);
    } catch (err) {
      setCustomers(previous);
      toast.error('Could not delete customer. They may have existing shipments.');
    }
  };

  // --- Staff -----------------------------------------------------------
  const addStaff = async (data) => {
    try {
      const { data: created } = await staffService.create(data);
      setStaff(prev => [normalizeStaffMember(created), ...prev]);
    } catch (err) {
      toast.error(err.response?.data?.email?.[0] || 'Could not add staff member.');
    }
  };

  const updateStaff = async (id, data) => {
    const previous = staff;
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    try {
      const { data: updated } = await staffService.update(id, data);
      setStaff(prev => prev.map(s => s.id === id ? normalizeStaffMember(updated) : s));
    } catch (err) {
      setStaff(previous);
      toast.error('Could not update staff member.');
    }
  };

  const deleteStaff = async (id) => {
    const previous = staff;
    setStaff(prev => prev.filter(s => s.id !== id));
    try {
      await staffService.delete(id);
    } catch (err) {
      setStaff(previous);
      toast.error('Could not remove staff member.');
    }
  };

  // --- Notifications -----------------------------------------------------
  const markNotifRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await notificationService.markRead(id);
    } catch (err) {
      // Non-critical — local state already reflects "read"; a failed
      // server sync here doesn't block the user, just leave it.
    }
  };
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      sidebarCollapsed, setSidebarCollapsed,
      mobileSidebarOpen, setMobileSidebarOpen,
      shipments, addShipment, updateShipment, deleteShipment,
      customers, addCustomer, updateCustomer, deleteCustomer,
      staff, addStaff, updateStaff, deleteStaff,
      notifications, markNotifRead, unreadCount,
      stats, monthlyStats, dataLoading, refreshAll,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);