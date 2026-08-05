import { NavLink, useNavigate } from 'react-router-dom';
import { FiPackage, FiHome, FiUsers, FiUserCheck, FiMap, FiBarChart2, FiSettings, FiLogOut, FiTruck, FiChevronLeft } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

import toast from 'react-hot-toast';

const NAV = [
  { section: 'Main', items: [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/shipments', icon: FiPackage, label: 'Shipments', badge: '3' },
    { to: '/tracking', icon: FiMap, label: 'Tracking' },
  ]},
  { section: 'People', items: [
    { to: '/customers', icon: FiUsers, label: 'Customers' },
    { to: '/staff', icon: FiUserCheck, label: 'Staff' },
  ]},
  { section: 'Analytics', items: [
    { to: '/reports', icon: FiBarChart2, label: 'Reports' },
  ]},
  { section: 'System', items: [
    { to: '/settings', icon: FiSettings, label: 'Settings' },
  ]},
];

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useApp();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const collapsed = sidebarCollapsed;

  return (
    <>
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">🚚</div>
        {!collapsed && (
          <div className="logo-text">
            <h2>MI Logistics</h2>
            <span>Virudhunagar, TN</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV.map(section => (
          <div key={section.section}>
            {!collapsed && <div className="nav-section-label">{section.section}</div>}
            {section.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileSidebarOpen(false)}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={handleLogout} title="Logout">
          <div className="user-avatar">{user?.initials || '?'}</div>
          {!collapsed && (
            <div className="user-info" style={{ flex: 1 }}>
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{user?.role || ''}</div>
            </div>
          )}
          {!collapsed && <FiLogOut size={15} color="var(--text-sidebar)" />}
        </div>
      </div>
    </aside>

    {/* Collapse Toggle (desktop) — sits outside the sidebar so its overflow:hidden doesn't clip it */}
    <button
      className="sidebar-collapse-toggle"
      onClick={() => setSidebarCollapsed(!collapsed)}
      style={{
        position: 'fixed', top: '20px',
        left: collapsed ? '57px' : '247px',
        width: '26px', height: '26px',
        background: 'var(--brand-accent)', border: 'none',
        borderRadius: '50%', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', zIndex: 1001, transition: 'left 0.3s, transform 0.3s',
        transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}
      title={collapsed ? 'Expand' : 'Collapse'}
    >
      <FiChevronLeft size={14} />
    </button>
    </>
  );
}
