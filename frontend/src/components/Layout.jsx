import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Calendar, ClipboardList, CreditCard, Star, User,
  HelpCircle, LogOut, Bell, MapPin, Wallet
} from 'lucide-react';
import './Layout.css';

const customerNav = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/create-request', label: 'Book a Service', icon: Calendar },
  { to: '/my-requests', label: 'My Requests', icon: ClipboardList },
//   { to: '/reviews', label: 'Reviews', icon: Star },
];

const providerNav = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/provider-jobs', label: 'My Jobs', icon: ClipboardList },
  { to: '/provider-dashboard', label: 'Nearby Requests', icon: MapPin },
];

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: Home },
];

function Layout({ children }) {
  const role = localStorage.getItem('role');
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = role === 'provider' ? providerNav : role === 'admin' ? adminNav : customerNav;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon"><Home size={20} /></div>
          <span>ChoreAid</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className={`sidebar-link ${active ? 'active' : ''}`}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link to="/dashboard" className="sidebar-link">
            <HelpCircle size={18} />
            <span>Help &amp; Support</span>
          </Link>
          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div />
          <div className="topbar-right">
            <button className="icon-btn"><Bell size={18} /></button>
            <div className="avatar-chip">
              <div className="avatar-circle"><User size={16} /></div>
              <span className="avatar-role">{role}</span>
            </div>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;