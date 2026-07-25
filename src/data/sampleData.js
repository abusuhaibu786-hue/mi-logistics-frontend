export const SHIPMENTS = [
  { id: 'SHP001', trackingNumber: 'MIL-2024-001', customer: 'Arjun Sharma', customerId: 'C001', origin: 'Virudhunagar', destination: 'Chennai', weight: '2.5 kg', status: 'delivered', priority: 'standard', amount: 320, date: '2024-02-10', deliveredDate: '2024-02-12', staff: 'Ramesh Kumar', phone: '+91 9876543210', address: '14, Anna Nagar, Chennai 600040' },
  { id: 'SHP002', trackingNumber: 'MIL-2024-002', customer: 'Priya Nair', customerId: 'C002', origin: 'Virudhunagar', destination: 'Coimbatore', weight: '5.0 kg', status: 'in-transit', priority: 'express', amount: 750, date: '2024-02-14', deliveredDate: null, staff: 'Senthil Murugan', phone: '+91 9765432109', address: '7, RS Puram, Coimbatore 641002' },
  { id: 'SHP003', trackingNumber: 'MIL-2024-003', customer: 'Vikram Patel', customerId: 'C003', origin: 'Virudhunagar', destination: 'Mumbai', weight: '12.0 kg', status: 'pending', priority: 'economy', amount: 1200, date: '2024-02-15', deliveredDate: null, staff: 'Karthik Raja', phone: '+91 9654321098', address: '52, Andheri West, Mumbai 400053' },
  { id: 'SHP004', trackingNumber: 'MIL-2024-004', customer: 'Meena Krishnan', customerId: 'C004', origin: 'Virudhunagar', destination: 'Madurai', weight: '1.2 kg', status: 'delivered', priority: 'express', amount: 220, date: '2024-02-08', deliveredDate: '2024-02-09', staff: 'Ramesh Kumar', phone: '+91 9543210987', address: '3, Goripalayam, Madurai 625002' },
  { id: 'SHP005', trackingNumber: 'MIL-2024-005', customer: 'Suresh Babu', customerId: 'C005', origin: 'Virudhunagar', destination: 'Bengaluru', weight: '8.0 kg', status: 'in-transit', priority: 'standard', amount: 890, date: '2024-02-13', deliveredDate: null, staff: 'Senthil Murugan', phone: '+91 9432109876', address: '88, Indiranagar, Bengaluru 560038' },
  { id: 'SHP006', trackingNumber: 'MIL-2024-006', customer: 'Lakshmi Devi', customerId: 'C006', origin: 'Virudhunagar', destination: 'Trichy', weight: '3.4 kg', status: 'delivered', priority: 'standard', amount: 280, date: '2024-02-05', deliveredDate: '2024-02-06', staff: 'Karthik Raja', phone: '+91 9321098765', address: '21, Thillai Nagar, Trichy 620018' },
  { id: 'SHP007', trackingNumber: 'MIL-2024-007', customer: 'Ravi Shankar', customerId: 'C007', origin: 'Virudhunagar', destination: 'Delhi', weight: '20.0 kg', status: 'pending', priority: 'economy', amount: 2400, date: '2024-02-15', deliveredDate: null, staff: 'Ramesh Kumar', phone: '+91 9210987654', address: '15, Rohini, Delhi 110085' },
  { id: 'SHP008', trackingNumber: 'MIL-2024-008', customer: 'Kavitha Sundaram', customerId: 'C008', origin: 'Virudhunagar', destination: 'Tirunelveli', weight: '4.5 kg', status: 'in-transit', priority: 'express', amount: 420, date: '2024-02-14', deliveredDate: null, staff: 'Karthik Raja', phone: '+91 9109876543', address: '9, Krishnapuram, Tirunelveli 627011' },
  { id: 'SHP009', trackingNumber: 'MIL-2024-009', customer: 'Muthu Raj', customerId: 'C009', origin: 'Virudhunagar', destination: 'Salem', weight: '7.0 kg', status: 'delivered', priority: 'standard', amount: 560, date: '2024-02-07', deliveredDate: '2024-02-09', staff: 'Senthil Murugan', phone: '+91 9098765432', address: '34, Fairlands, Salem 636016' },
  { id: 'SHP010', trackingNumber: 'MIL-2024-010', customer: 'Divya Menon', customerId: 'C010', origin: 'Virudhunagar', destination: 'Kochi', weight: '9.0 kg', status: 'cancelled', priority: 'express', amount: 980, date: '2024-02-11', deliveredDate: null, staff: 'Ramesh Kumar', phone: '+91 8987654321', address: '5, Ernakulam, Kochi 682016' },
];

export const CUSTOMERS = [
  { id: 'C001', name: 'Arjun Sharma', email: 'arjun.sharma@email.com', phone: '+91 9876543210', city: 'Chennai', state: 'Tamil Nadu', totalShipments: 14, totalSpent: 4280, joinDate: '2023-04-12', status: 'active' },
  { id: 'C002', name: 'Priya Nair', email: 'priya.nair@email.com', phone: '+91 9765432109', city: 'Coimbatore', state: 'Tamil Nadu', totalShipments: 8, totalSpent: 5820, joinDate: '2023-06-22', status: 'active' },
  { id: 'C003', name: 'Vikram Patel', email: 'vikram.patel@email.com', phone: '+91 9654321098', city: 'Mumbai', state: 'Maharashtra', totalShipments: 22, totalSpent: 18400, joinDate: '2023-02-08', status: 'active' },
  { id: 'C004', name: 'Meena Krishnan', email: 'meena.krishnan@email.com', phone: '+91 9543210987', city: 'Madurai', state: 'Tamil Nadu', totalShipments: 5, totalSpent: 1200, joinDate: '2023-09-14', status: 'active' },
  { id: 'C005', name: 'Suresh Babu', email: 'suresh.babu@email.com', phone: '+91 9432109876', city: 'Bengaluru', state: 'Karnataka', totalShipments: 17, totalSpent: 12450, joinDate: '2023-03-30', status: 'inactive' },
  { id: 'C006', name: 'Lakshmi Devi', email: 'lakshmi.devi@email.com', phone: '+91 9321098765', city: 'Trichy', state: 'Tamil Nadu', totalShipments: 6, totalSpent: 1680, joinDate: '2023-07-19', status: 'active' },
  { id: 'C007', name: 'Ravi Shankar', email: 'ravi.shankar@email.com', phone: '+91 9210987654', city: 'Delhi', state: 'Delhi', totalShipments: 31, totalSpent: 62400, joinDate: '2022-11-05', status: 'active' },
  { id: 'C008', name: 'Kavitha Sundaram', email: 'kavitha.sundaram@email.com', phone: '+91 9109876543', city: 'Tirunelveli', state: 'Tamil Nadu', totalShipments: 9, totalSpent: 3780, joinDate: '2023-08-27', status: 'active' },
];

export const STAFF = [
  { id: 'ST001', name: 'Ramesh Kumar', email: 'ramesh.kumar@milogistics.com', phone: '+91 9876501234', role: 'Delivery Manager', department: 'Operations', joinDate: '2021-03-15', salary: 42000, status: 'active', deliveries: 284, rating: 4.8, address: 'Virudhunagar' },
  { id: 'ST002', name: 'Senthil Murugan', email: 'senthil.murugan@milogistics.com', phone: '+91 9765012345', role: 'Senior Driver', department: 'Delivery', joinDate: '2021-08-20', salary: 28000, status: 'active', deliveries: 196, rating: 4.6, address: 'Virudhunagar' },
  { id: 'ST003', name: 'Karthik Raja', email: 'karthik.raja@milogistics.com', phone: '+91 9654012345', role: 'Warehouse Staff', department: 'Warehouse', joinDate: '2022-01-10', salary: 22000, status: 'active', deliveries: 142, rating: 4.5, address: 'Sivakasi' },
  { id: 'ST004', name: 'Prabhakaran S', email: 'prabhakaran@milogistics.com', phone: '+91 9543012345', role: 'Driver', department: 'Delivery', joinDate: '2022-05-18', salary: 25000, status: 'active', deliveries: 108, rating: 4.3, address: 'Aruppukottai' },
  { id: 'ST005', name: 'Jeevitha R', email: 'jeevitha@milogistics.com', phone: '+91 9432012345', role: 'Customer Service', department: 'Support', joinDate: '2022-09-05', salary: 20000, status: 'active', deliveries: 0, rating: 4.7, address: 'Virudhunagar' },
  { id: 'ST006', name: 'Balamurugan T', email: 'balamurugan@milogistics.com', phone: '+91 9321012345', role: 'Driver', department: 'Delivery', joinDate: '2023-02-14', salary: 23000, status: 'on-leave', deliveries: 67, rating: 4.2, address: 'Rajapalayam' },
];

export const MONTHLY_DATA = {
  labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
  revenue: [182000, 215000, 248000, 195000, 312000, 278000, 345000],
  shipments: [340, 412, 468, 380, 590, 524, 648],
  delivered: [310, 380, 435, 342, 551, 490, 612],
};

export const TRACKING_EVENTS = {
  'MIL-2024-002': {
    trackingNumber: 'MIL-2024-002',
    customer: 'Priya Nair',
    origin: 'Virudhunagar, Tamil Nadu',
    destination: 'Coimbatore, Tamil Nadu',
    status: 'in-transit',
    estimatedDelivery: '2024-02-16',
    weight: '5.0 kg',
    service: 'Express',
    events: [
      { title: 'Package Picked Up', desc: 'Package picked up from sender', location: 'Virudhunagar', time: '10 Feb 2024, 9:00 AM', done: true, active: false },
      { title: 'Sorted at Facility', desc: 'Package sorted at Virudhunagar hub', location: 'Virudhunagar Hub', time: '10 Feb 2024, 2:00 PM', done: true, active: false },
      { title: 'Dispatched', desc: 'Package dispatched to destination city', location: 'Virudhunagar', time: '11 Feb 2024, 7:00 AM', done: true, active: false },
      { title: 'In Transit', desc: 'Package is on the way to Coimbatore', location: 'Dindigul', time: '14 Feb 2024, 11:00 AM', done: false, active: true },
      { title: 'Out for Delivery', desc: 'Package is out for delivery', location: 'Coimbatore', time: 'Expected 16 Feb 2024', done: false, active: false },
      { title: 'Delivered', desc: 'Package delivered to recipient', location: 'Coimbatore', time: 'Expected 16 Feb 2024', done: false, active: false },
    ],
  },
  'MIL-2024-001': {
    trackingNumber: 'MIL-2024-001',
    customer: 'Arjun Sharma',
    origin: 'Virudhunagar, Tamil Nadu',
    destination: 'Chennai, Tamil Nadu',
    status: 'delivered',
    estimatedDelivery: '2024-02-12',
    weight: '2.5 kg',
    service: 'Standard',
    events: [
      { title: 'Package Picked Up', desc: 'Package picked up from sender', location: 'Virudhunagar', time: '10 Feb 2024, 9:00 AM', done: true, active: false },
      { title: 'Sorted at Facility', desc: 'Package sorted at hub', location: 'Virudhunagar Hub', time: '10 Feb 2024, 1:00 PM', done: true, active: false },
      { title: 'Dispatched', desc: 'Package dispatched to Chennai', location: 'Virudhunagar', time: '11 Feb 2024, 6:00 AM', done: true, active: false },
      { title: 'Arrived at City Hub', desc: 'Package arrived at Chennai hub', location: 'Chennai Hub', time: '11 Feb 2024, 6:00 PM', done: true, active: false },
      { title: 'Out for Delivery', desc: 'Package out for delivery', location: 'Chennai', time: '12 Feb 2024, 9:00 AM', done: true, active: false },
      { title: 'Delivered', desc: 'Package successfully delivered', location: 'Anna Nagar, Chennai', time: '12 Feb 2024, 2:30 PM', done: true, active: true },
    ],
  },
};

export const NOTIFICATIONS = [
  { id: 1, title: 'New Shipment Booked', text: 'SHP010 booked for Kochi delivery', time: '5 min ago', read: false },
  { id: 2, title: 'Delivery Confirmed', text: 'MIL-2024-004 delivered to Madurai', time: '1 hr ago', read: false },
  { id: 3, title: 'Payment Received', text: '₹1,200 received from Vikram Patel', time: '3 hrs ago', read: false },
  { id: 4, title: 'Staff Leave Request', text: 'Balamurugan T applied for leave', time: 'Yesterday', read: true },
  { id: 5, title: 'New Customer Registration', text: 'Muthu Raj created an account', time: 'Yesterday', read: true },
];
