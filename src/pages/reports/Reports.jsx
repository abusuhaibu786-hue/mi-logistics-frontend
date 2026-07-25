import { useState } from 'react';
import { FiDownload, FiBarChart2, FiTrendingUp, FiPackage, FiDollarSign, FiCalendar, FiPrinter } from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useApp } from '../../context/AppContext';
import { TabList } from '../../components/common/UIComponents';
import { formatCurrency } from '../../utils/helpers';
import { MONTHLY_DATA } from '../../data/sampleData';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartBase = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
  scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true } },
};

export default function Reports() {
  const { shipments, customers } = useApp();
  const [tab, setTab] = useState('Monthly');
  const [range, setRange] = useState('Last 7 Months');

  const handleExport = (type) => toast.success(`${type} export started!`);

  const revenueData = {
    labels: MONTHLY_DATA.labels,
    datasets: [{
      label: 'Revenue (₹)',
      data: MONTHLY_DATA.revenue,
      borderColor: '#F97316',
      backgroundColor: 'rgba(249,115,22,0.08)',
      fill: true, tension: 0.4,
      pointBackgroundColor: '#F97316', pointRadius: 5,
    }],
  };

  const shipmentBarData = {
    labels: MONTHLY_DATA.labels,
    datasets: [
      { label: 'Total', data: MONTHLY_DATA.shipments, backgroundColor: 'rgba(59,130,246,0.75)', borderRadius: 5 },
      { label: 'Delivered', data: MONTHLY_DATA.delivered, backgroundColor: 'rgba(16,185,129,0.75)', borderRadius: 5 },
    ],
  };

  const statusDoughnut = {
    labels: ['Delivered', 'In Transit', 'Pending', 'Cancelled'],
    datasets: [{
      data: [
        shipments.filter(s => s.status === 'delivered').length,
        shipments.filter(s => s.status === 'in-transit').length,
        shipments.filter(s => s.status === 'pending').length,
        shipments.filter(s => s.status === 'cancelled').length,
      ],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
      borderWidth: 0,
    }],
  };

  const deliveryRateData = {
    labels: MONTHLY_DATA.labels,
    datasets: [{
      label: 'Delivery Rate %',
      data: MONTHLY_DATA.delivered.map((d, i) => Math.round((d / MONTHLY_DATA.shipments[i]) * 100)),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16,185,129,0.08)',
      fill: true, tension: 0.4,
      pointBackgroundColor: '#10B981', pointRadius: 5,
    }],
  };

  const summaryStats = [
    { label: 'Total Revenue', val: formatCurrency(MONTHLY_DATA.revenue.reduce((a, b) => a + b, 0)), icon: FiDollarSign, color: 'var(--brand-accent)', bg: 'rgba(249,115,22,0.1)' },
    { label: 'Total Shipments', val: MONTHLY_DATA.shipments.reduce((a, b) => a + b, 0).toLocaleString(), icon: FiPackage, color: 'var(--brand-info)', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Avg. Delivery Rate', val: `${Math.round(MONTHLY_DATA.delivered.reduce((a, b) => a + b, 0) / MONTHLY_DATA.shipments.reduce((a, b) => a + b, 0) * 100)}%`, icon: FiTrendingUp, color: 'var(--brand-success)', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Active Customers', val: customers.filter(c => c.status === 'active').length, icon: FiBarChart2, color: 'var(--brand-warning)', bg: 'rgba(245,158,11,0.1)' },
  ];

  const topRoutes = [
    { route: 'Virudhunagar → Chennai', count: 142, revenue: 45600 },
    { route: 'Virudhunagar → Madurai', count: 98, revenue: 21800 },
    { route: 'Virudhunagar → Bengaluru', count: 87, revenue: 78300 },
    { route: 'Virudhunagar → Coimbatore', count: 76, revenue: 57000 },
    { route: 'Virudhunagar → Mumbai', count: 54, revenue: 64800 },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Reports & Analytics</h1>
          <p>Business intelligence and performance metrics for MI Logistics</p>
        </div>
        <div className="page-header-actions">
          <select className="form-control filter-select" value={range} onChange={e => setRange(e.target.value)} style={{ height: 38 }}>
            {['Last 7 Months', 'Last 3 Months', 'This Year', 'All Time'].map(r => <option key={r}>{r}</option>)}
          </select>
          <button className="btn btn-secondary" onClick={() => handleExport('PDF')}><FiPrinter size={14} /> Print</button>
          <button className="btn btn-primary" onClick={() => handleExport('Excel')}><FiDownload size={14} /> Export</button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-4 mb-6">
        {summaryStats.map(s => (
          <div key={s.label} className="card">
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={22} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk'", marginTop: 2 }}>{s.val}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <TabList tabs={['Monthly', 'Revenue', 'Delivery', 'Routes']} active={tab} onChange={setTab} />

      {tab === 'Monthly' && (
        <div>
          <div className="grid grid-2-1 mb-5">
            <div className="card">
              <div className="card-header">
                <span className="card-title"><FiBarChart2 size={15} /> Monthly Shipment Volume</span>
                <div className="flex items-center gap-3">
                  <span className="badge badge-info">● Total</span>
                  <span className="badge badge-success">● Delivered</span>
                </div>
              </div>
              <div className="card-body" style={{ paddingTop: 0 }}>
                <div style={{ height: 260 }}>
                  <Bar data={shipmentBarData} options={{ ...chartBase, plugins: { ...chartBase.plugins, legend: { display: false } } }} />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Status Breakdown</span></div>
              <div className="card-body" style={{ paddingTop: 0 }}>
                <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Doughnut data={statusDoughnut} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 10, font: { size: 12 } } } }, cutout: '65%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Monthly table */}
          <div className="card">
            <div className="card-header"><span className="card-title"><FiCalendar size={15} /> Month-by-Month Breakdown</span></div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr><th>Month</th><th>Total Shipments</th><th>Delivered</th><th>Pending/Transit</th><th>Revenue</th><th>Delivery Rate</th></tr>
                </thead>
                <tbody>
                  {MONTHLY_DATA.labels.map((month, i) => {
                    const rate = Math.round((MONTHLY_DATA.delivered[i] / MONTHLY_DATA.shipments[i]) * 100);
                    return (
                      <tr key={month}>
                        <td><span style={{ fontWeight: 600 }}>{month} 2024</span></td>
                        <td>{MONTHLY_DATA.shipments[i]}</td>
                        <td><span style={{ color: 'var(--brand-success)', fontWeight: 600 }}>{MONTHLY_DATA.delivered[i]}</span></td>
                        <td>{MONTHLY_DATA.shipments[i] - MONTHLY_DATA.delivered[i]}</td>
                        <td><span style={{ fontWeight: 600 }}>{formatCurrency(MONTHLY_DATA.revenue[i])}</span></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div style={{ flex: 1, height: 6, background: 'var(--bg-surface-2)', borderRadius: 3 }}>
                              <div style={{ width: `${rate}%`, height: '100%', background: rate > 90 ? 'var(--brand-success)' : 'var(--brand-warning)', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, width: 36 }}>{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'Revenue' && (
        <div>
          <div className="card mb-5">
            <div className="card-header">
              <span className="card-title"><FiTrendingUp size={15} /> Revenue Trend</span>
              <span className="badge badge-success">↑ 23.8% YoY Growth</span>
            </div>
            <div className="card-body" style={{ paddingTop: 0 }}>
              <div style={{ height: 300 }}>
                <Line data={revenueData} options={chartBase} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Revenue by Month</span><button className="btn btn-secondary btn-sm" onClick={() => handleExport('Revenue CSV')}><FiDownload size={13} /> Export CSV</button></div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead><tr><th>Month</th><th>Revenue</th><th>Shipments</th><th>Avg per Shipment</th><th>Growth</th></tr></thead>
                <tbody>
                  {MONTHLY_DATA.labels.map((month, i) => {
                    const growth = i > 0 ? Math.round(((MONTHLY_DATA.revenue[i] - MONTHLY_DATA.revenue[i-1]) / MONTHLY_DATA.revenue[i-1]) * 100) : 0;
                    return (
                      <tr key={month}>
                        <td><span style={{ fontWeight: 600 }}>{month} 2024</span></td>
                        <td><span style={{ fontWeight: 700, color: 'var(--brand-accent)' }}>{formatCurrency(MONTHLY_DATA.revenue[i])}</span></td>
                        <td>{MONTHLY_DATA.shipments[i]}</td>
                        <td>{formatCurrency(Math.round(MONTHLY_DATA.revenue[i] / MONTHLY_DATA.shipments[i]))}</td>
                        <td>
                          {i === 0 ? <span style={{ color: 'var(--text-muted)' }}>—</span> : (
                            <span style={{ color: growth >= 0 ? 'var(--brand-success)' : 'var(--brand-danger)', fontWeight: 600 }}>
                              {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'Delivery' && (
        <div>
          <div className="card mb-5">
            <div className="card-header">
              <span className="card-title">Delivery Rate Over Time</span>
              <span className="badge badge-success">Avg. 94.2%</span>
            </div>
            <div className="card-body" style={{ paddingTop: 0 }}>
              <div style={{ height: 280 }}>
                <Line data={deliveryRateData} options={{ ...chartBase, scales: { ...chartBase.scales, y: { ...chartBase.scales.y, min: 80, max: 100 } } }} />
              </div>
            </div>
          </div>
          <div className="grid grid-3">
            {[
              { label: 'On-Time Deliveries', val: '94.2%', desc: '+2.1% vs last period', color: 'var(--brand-success)' },
              { label: 'Avg. Delivery Time', val: '2.4 Days', desc: 'Within Tamil Nadu', color: 'var(--brand-info)' },
              { label: 'Failed Deliveries', val: '5.8%', desc: '−1.2% vs last period', color: 'var(--brand-danger)' },
            ].map(m => (
              <div key={m.label} className="card">
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: m.color, fontFamily: "'Space Grotesk'", marginBottom: 6 }}>{m.val}</div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Routes' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Top Delivery Routes</span>
            <button className="btn btn-secondary btn-sm" onClick={() => handleExport('Routes PDF')}><FiDownload size={13} /> Export</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead><tr><th>Route</th><th>Shipments</th><th>Revenue</th><th>Avg per Shipment</th><th>Share</th></tr></thead>
              <tbody>
                {topRoutes.map((r, i) => {
                  const totalCount = topRoutes.reduce((s, rr) => s + rr.count, 0);
                  const share = Math.round((r.count / totalCount) * 100);
                  return (
                    <tr key={r.route}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--brand-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                          <span style={{ fontWeight: 500 }}>{r.route}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-info">{r.count}</span></td>
                      <td><span style={{ fontWeight: 700 }}>{formatCurrency(r.revenue)}</span></td>
                      <td>{formatCurrency(Math.round(r.revenue / r.count))}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div style={{ flex: 1, height: 6, background: 'var(--bg-surface-2)', borderRadius: 3 }}>
                            <div style={{ width: `${share}%`, height: '100%', background: 'var(--brand-accent)', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, width: 32 }}>{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
