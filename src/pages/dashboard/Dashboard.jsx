import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiCheckCircle, FiClock, FiTruck, FiArrowUp, FiArrowDown, FiPlus, FiArrowRight, FiMapPin, FiExternalLink } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useApp } from '../../context/AppContext';
import { StatCard, StatusBadge, SkeletonCard } from '../../components/common/UIComponents';
import { formatCurrency, formatDate } from '../../utils/helpers';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
  scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true } },
};

export default function Dashboard() {
  const { stats, shipments, monthlyStats } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  const recentShipments = shipments.slice(0, 6);

  const revenueData = {
    labels: monthlyStats.labels,
    datasets: [{
      label: 'Revenue',
      data: monthlyStats.revenue,
      borderColor: '#F97316',
      backgroundColor: 'rgba(249,115,22,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#F97316',
      pointRadius: 4,
    }],
  };

  const shipmentData = {
    labels: monthlyStats.labels,
    datasets: [
      { label: 'Total', data: monthlyStats.shipments, backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 4 },
      { label: 'Delivered', data: monthlyStats.delivered, backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 4 },
    ],
  };

  const donutData = {
    labels: ['Delivered', 'In Transit', 'Pending', 'Cancelled'],
    datasets: [{
      data: [stats.delivered, stats.inTransit, stats.pending, shipments.filter(s => s.status === 'cancelled').length],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
      borderWidth: 0,
    }],
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with MI Logistics today.</p>
        </div>
        <div className="page-header-actions">
          <Link to="/shipments" className="btn btn-primary">
            <FiPlus size={15} /> New Shipment
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-4 mb-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Total Shipments" value={stats.total} change="↑ 12% this month" changeType="up" icon={FiPackage} accent="accent-orange" iconBg="rgba(249,115,22,0.1)" iconColor="var(--brand-accent)" />
            <StatCard label="Delivered" value={stats.delivered} change="↑ 8% this month" changeType="up" icon={FiCheckCircle} accent="accent-green" iconBg="rgba(16,185,129,0.1)" iconColor="var(--brand-success)" />
            <StatCard label="Pending" value={stats.pending} change="↓ 3% this month" changeType="down" icon={FiClock} accent="accent-yellow" iconBg="rgba(245,158,11,0.1)" iconColor="var(--brand-warning)" />
            <StatCard label="In Transit" value={stats.inTransit} change="↑ 5% this month" changeType="up" icon={FiTruck} accent="accent-blue" iconBg="rgba(59,130,246,0.1)" iconColor="var(--brand-info)" />
          </>
        )}
      </div>

      {/* Revenue highlight */}
      <div className="card mb-6" style={{ background: 'linear-gradient(135deg, var(--brand-primary) 0%, #1E3A5F 100%)', border: 'none' }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 4 }}>Total Revenue (All Time)</p>
            <h2 style={{ color: '#fff', fontSize: 32, fontFamily: "'Space Grotesk'", margin: 0 }}>{formatCurrency(stats.revenue)}</h2>
            <p style={{ color: 'var(--brand-accent)', fontSize: 13, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiArrowUp size={13} /> +18.4% compared to last month
            </p>
          </div>
          <div style={{ display: 'flex', gap: 40 }}>
            {[['Avg. Order', formatCurrency(Math.round(stats.revenue / stats.total))], ['Delivery Rate', '94.6%'], ['Active Customers', '248']].map(([lbl, val]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk'" }}>{val}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-2-1 mb-6">
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Revenue Overview</span>
            <select className="form-control" style={{ width: 'auto', fontSize: 12, height: 32, padding: '0 10px' }}>
              <option>Last 7 Months</option>
            </select>
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            <div style={{ height: 240 }}>
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Donut */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Shipment Status</span>
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 12, font: { size: 12 } } } }, cutout: '68%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="card mb-6">
        <div className="card-header">
          <span className="card-title">Monthly Shipment Statistics</span>
          <div className="flex items-center gap-3">
            <span className="badge badge-info">● Total</span>
            <span className="badge badge-success">● Delivered</span>
          </div>
        </div>
        <div className="card-body" style={{ paddingTop: 0 }}>
          <div style={{ height: 220 }}>
            <Bar data={shipmentData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
          </div>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="card">
        <div className="card-header">
          <span className="card-title"><FiPackage size={16} /> Recent Shipments</span>
          <Link to="/shipments" className="btn btn-secondary btn-sm flex items-center gap-2">
            View All <FiArrowRight size={13} />
          </Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking No.</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentShipments.map(s => (
                <tr key={s.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--brand-accent)', fontWeight: 600 }}>{s.trackingNumber}</span></td>
                  <td><span style={{ fontWeight: 500 }}>{s.customer}</span></td>
                  <td><span style={{ color: 'var(--text-muted)' }}>{s.destination}</span></td>
                  <td><span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{formatDate(s.date)}</span></td>
                  <td><span style={{ fontWeight: 600 }}>{formatCurrency(s.amount)}</span></td>
                  <td><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Office Location */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <span className="card-title"><FiMapPin size={16} /> Our Office Location</span>
          <a
            href="https://www.google.com/maps?cid=4773867466376486429"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm flex items-center gap-2"
          >
            Open in Google Maps <FiExternalLink size={13} />
          </a>
        </div>
        <div className="card-body" style={{ paddingTop: 0 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
            MI Logistics — Virudhunagar, Tamil Nadu, India
          </p>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <iframe
              title="MI Logistics Office Location - Virudhunagar"
              src="https://www.google.com/maps?cid=4773867466376486429&output=embed"
              width="100%"
              height="320"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/919363252243"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat with us on WhatsApp"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#25D366',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
          zIndex: 1000,
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <FaWhatsapp />
      </a>
    </div>
  );
}
