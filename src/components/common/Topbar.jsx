import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMenu, FiSearch, FiBell, FiSun, FiMoon, FiX } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

const BREADCRUMBS = {
  '/dashboard': ['Dashboard'],
  '/shipments': ['Dashboard', 'Shipments'],
  '/shipments/new': ['Dashboard', 'Shipments', 'New Shipment'],
  '/tracking': ['Dashboard', 'Tracking'],
  '/customers': ['Dashboard', 'Customers'],
  '/staff': ['Dashboard', 'Staff'],
  '/reports': ['Dashboard', 'Reports'],
  '/settings': ['Dashboard', 'Settings'],
};

export default function Topbar() {
  const { sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen, theme, toggleTheme, notifications, markNotifRead, unreadCount } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const notifRef = useRef();
  const location = useLocation();

  const breadcrumb = BREADCRUMBS[location.pathname] || ['Dashboard'];

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className={`topbar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="topbar-left">
        {/* Mobile hamburger */}
        <button className="topbar-toggle mobile-only" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
          {mobileSidebarOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop collapse toggle */}
        <button
          className="topbar-toggle"
          style={{ display: 'none' }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <FiMenu />
        </button>

        {/* Breadcrumb */}
        <nav className="breadcrumb">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="breadcrumb-sep">/</span>}
              <span className={i === breadcrumb.length - 1 ? 'breadcrumb-current' : ''}>{crumb}</span>
            </span>
          ))}
        </nav>
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className="topbar-search">
          <FiSearch size={15} color="var(--text-muted)" />
          <input
            placeholder="Search shipments, customers..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
          />
        </div>

        {/* Theme Toggle */}
        <button className="icon-btn" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? <FiMoon size={17} /> : <FiSun size={17} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setShowNotif(!showNotif)} title="Notifications">
            <FiBell size={17} />
            {unreadCount > 0 && <span className="notif-dot" />}
          </button>

          {showNotif && (
            <div className="dropdown-menu notif-panel" style={{ right: 0, top: 'calc(100% + 8px)', minWidth: 340 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                {unreadCount > 0 && <span className="badge badge-orange">{unreadCount} New</span>}
              </div>
              {notifications.map(n => (
                <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => markNotifRead(n.id)}>
                  {!n.read && <div className="notif-dot-indicator" />}
                  <div>
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-text">{n.text}</div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: '10px', textAlign: 'center', fontSize: 12, color: 'var(--brand-accent)', cursor: 'pointer', borderTop: '1px solid var(--border-color)' }}>
                View all notifications
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
