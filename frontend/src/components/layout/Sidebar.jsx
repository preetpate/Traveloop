import {
  LayoutDashboard,
  Map,
  Wallet,
  Package,
  StickyNote,
  Compass,
  User,
  LogOut,
  Plane,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ConfirmDialog from '../ui/ConfirmDialog';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Map,             label: 'My Trips',  path: '/my-trips' },
  { icon: Compass,         label: 'Explore',   path: '/explore-cities' },
  { icon: Wallet,          label: 'Budget',    path: '/budget' },
  { icon: Package,         label: 'Packing',   path: '/packing-checklist' },
  { icon: StickyNote,      label: 'Notes',     path: '/trip-notes' },
  { icon: User,            label: 'Profile',   path: '/profile' },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-card/40 backdrop-blur-xl border-r border-border h-screen sticky top-0 z-40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-medium group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-text-primary tracking-tight">Traveloop</span>
          </Link>
        </div>

        {/* User pill */}
        {user && (
          <div className="mx-4 mt-4 p-3 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-text-primary font-semibold text-sm truncate">{user.name}</p>
              <p className="text-text-secondary text-xs truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 group ${
                  active
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-medium'
                    : 'text-text-secondary hover:bg-card hover:text-text-primary'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'group-hover:text-primary transition-colors'}`} />
                <span className="font-medium text-sm">{label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-danger/10 hover:text-danger transition-all duration-150 w-full group"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map(({ icon: Icon, label, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-150 min-w-0 ${
                  active ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all ${active ? 'bg-primary/15' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold truncate">{label}</span>
              </Link>
            );
          })}
          {/* More button for remaining items */}
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-150 ${
              isActive('/profile') ? 'text-primary' : 'text-text-secondary'
            }`}
          >
            <div className={`p-1.5 rounded-lg transition-all ${isActive('/profile') ? 'bg-primary/15' : ''}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold">Profile</span>
          </Link>
        </div>
      </nav>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        variant="danger"
      />
    </>
  );
}
