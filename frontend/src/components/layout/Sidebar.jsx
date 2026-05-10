import { 
  LayoutDashboard, 
  Map, 
  Wallet, 
  Package, 
  StickyNote, 
  Compass,
  User,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ConfirmDialog from '../ui/ConfirmDialog';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Map, label: 'My Trips', path: '/my-trips' },
    { icon: Compass, label: 'Explore', path: '/explore-cities' },
    { icon: Wallet, label: 'Budget', path: '/budget' },
    { icon: Package, label: 'Packing', path: '/packing-checklist' },
    { icon: StickyNote, label: 'Notes', path: '/trip-notes' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-border h-screen sticky top-0 shadow-soft">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-medium">
              <Map className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-text-primary">
              Traveloop
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-primary text-white shadow-medium'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-danger/10 hover:text-danger transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmLabel="Logout"
        cancelLabel="Cancel"
        variant="danger"
      />
    </>
  );
};

export default Sidebar;
