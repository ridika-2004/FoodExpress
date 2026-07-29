import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, ChevronDown, Shield, Bike, LogOut, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, isLoggedIn, role, logout } = useAuth();
  const location = useLocation();

  // Role-based navigation links
  const navLinks = [
    { label: 'Home', path: '/', roles: ['user', 'admin', 'deliveryman', 'guest'] },
    { label: 'Restaurants', path: '/restaurants', roles: ['user', 'guest'] },
    { label: 'My Orders', path: '/orders', roles: ['user'] },
    { label: 'Deliveries', path: '/deliveryman', roles: ['deliveryman'] },
    { label: 'Dashboard', path: '/admin/dashboard', roles: ['admin'] },
  ];

  const filteredLinks = navLinks.filter(link =>
    link.roles.includes(role || 'guest')
  );

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileOpen(false);
  };

  const getRoleBadge = () => {
    if (role === 'admin') return { label: 'Admin', classes: 'bg-purple-100 text-purple-700' };
    if (role === 'deliveryman') return { label: 'Delivery', classes: 'bg-primary/10 text-primary' };
    return null;
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              Food<span className="text-primary">Express</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {filteredLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 rounded-xl text-foreground-muted hover:text-foreground hover:bg-muted transition-all duration-200 cursor-pointer"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Cart — only for regular users */}
            {role === 'user' && (
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl text-foreground-muted hover:text-foreground hover:bg-muted transition-all duration-200"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl hover:bg-muted transition-all duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} className="text-primary" />
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="text-sm font-medium text-foreground block leading-tight">{user?.name?.split(' ')[0]}</span>
                    {badge && (
                      <span className={`text-[10px] font-semibold ${badge.classes} px-1.5 py-0.5 rounded`}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  <ChevronDown size={14} className="text-foreground-muted hidden md:block" />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-border rounded-2xl shadow-xl py-2 z-20 animate-slide-up">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-bold text-foreground">{user?.name}</p>
                        <p className="text-xs text-foreground-muted mt-0.5">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        {role === 'user' && (
                          <Link
                            to="/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                          >
                            <ShoppingCart size={16} className="text-foreground-muted" />
                            My Orders
                          </Link>
                        )}
                        {role === 'deliveryman' && (
                          <Link
                            to="/deliveryman"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                          >
                            <Bike size={16} className="text-foreground-muted" />
                            Dashboard
                          </Link>
                        )}
                        {role === 'admin' && (
                          <>
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                            >
                              <Store size={16} className="text-foreground-muted" />
                              Restaurant Dashboard
                            </Link>
                            <Link
                              to="/admin/deliveries"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                            >
                              <Shield size={16} className="text-foreground-muted" />
                              All Deliveries
                            </Link>
                          </>
                        )}
                      </div>
                      <div className="border-t border-border pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full cursor-pointer"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-[0.97]"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-foreground-muted hover:text-foreground hover:bg-muted transition-all duration-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden border-t border-border bg-white animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {filteredLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'bg-primary/5 text-primary'
                    : 'text-foreground-muted hover:bg-muted hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/10">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={16} className="text-primary" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{user?.name}</p>
                      <p className="text-xs text-foreground-muted">{user?.email}</p>
                    </div>
                    {badge && (
                      <span className={`text-xs font-semibold ${badge.classes} px-2 py-0.5 rounded-full ml-auto`}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full cursor-pointer"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-white bg-primary text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="border-t border-border bg-white animate-slide-down">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search for restaurants or dishes..."
                className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
