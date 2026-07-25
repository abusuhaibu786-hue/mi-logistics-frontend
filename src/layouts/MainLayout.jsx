import { useApp } from '../context/AppContext';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';

export default function MainLayout({ children }) {
  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useApp();

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <Sidebar />

      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Topbar />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
