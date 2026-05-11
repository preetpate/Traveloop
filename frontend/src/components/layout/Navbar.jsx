import { Bell, User, ChevronDown, Menu, X, Plane } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-card/80 backdrop-blur-xl border-b border-border shadow-medium'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Mobile: Logo */}
          <Link to="/dashboard" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-text-primary text-lg">Traveloop</span>
          </Link>

          {/* Desktop: Page title area (empty, sidebar has logo) */}
          <div className="hidden lg:block flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification bell */}
            <button className="relative p-2 hover:bg-card/60 rounded-xl transition-all duration-150">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-background" />
            </button>

            {/* User dropdown — desktop */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 pl-3 border-l border-border hover:opacity-80 transition-all duration-150"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-text-primary leading-tight">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-text-secondary truncate max-w-[120px]">{user?.email || ''}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-medium flex-shrink-0">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-large overflow-hidden z-20">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-text-primary text-sm">{user?.name}</p>
                      <p className="text-text-secondary text-xs truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-primary/10 transition-all duration-150">
                      <User className="w-4 h-4" /> Profile Settings
                    </Link>
                    <Link to="/my-trips" onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-primary/10 transition-all duration-150">
                      <Plane className="w-4 h-4" /> My Trips
                    </Link>
                    <button
                      onClick={() => { setShowDropdown(false); logout(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-danger/10 transition-all duration-150 border-t border-border"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile avatar */}
            <button
              onClick={() => navigate('/profile')}
              className="sm:hidden w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-medium"
            >
              <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
