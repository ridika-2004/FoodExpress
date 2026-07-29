import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, ChefHat, Bike, UserCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../data/mockData';

type AuthMode = 'login' | 'register';

const roles: { value: UserRole; label: string; icon: typeof UserCircle; desc: string }[] = [
  { value: 'user', label: 'Customer', icon: UserCircle, desc: 'Order delicious food' },
  { value: 'deliveryman', label: 'Delivery Partner', icon: Bike, desc: 'Deliver orders & earn' },
  { value: 'admin', label: 'Admin', icon: Shield, desc: 'Manage platform & users' },
];

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (mode === 'login') {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password. Try admin@foodexpress.com or john@foodexpress.com');
      }
    } else {
      const success = await register(name, regEmail, phone, regPassword, selectedRole);
      if (success) {
        navigate('/');
      } else {
        setError('Registration failed. Please try again.');
      }
    }

    setIsLoading(false);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setShowPassword(false);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <span className="text-white font-bold text-xl">F</span>
          </div>
        </Link>

        {/* Tab Toggle */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex border-b border-border">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 cursor-pointer relative ${
                mode === 'login'
                  ? 'text-primary'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Sign In
              {mode === 'login' && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 cursor-pointer relative ${
                mode === 'register'
                  ? 'text-primary'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Sign Up
              {mode === 'register' && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Error */}
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* —— SIGN IN —— */}
            {mode === 'login' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-11 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                    <span className="text-sm text-foreground-muted">Remember me</span>
                  </label>
                  <Link to="#" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-200">
                    Forgot password?
                  </Link>
                </div>

                {/* Demo hint */}
                <p className="text-xs text-foreground-muted text-center bg-muted rounded-xl p-3">
                  Demo: <strong>ridika@example.com</strong> (user) · <strong>admin@foodexpress.com</strong> (admin) · <strong>john@foodexpress.com</strong> (delivery)
                </p>
              </div>
            )}

            {/* —— SIGN UP —— */}
            {mode === 'register' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                    <input
                      id="reg-email"
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 555 000 0000"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      className="w-full pl-10 pr-11 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    I want to join as
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {roles.map(r => {
                      const Icon = r.icon;
                      const isSelected = selectedRole === r.value;
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setSelectedRole(r.value)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border bg-white hover:border-primary/40 hover:bg-muted/50'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-primary text-white' : 'bg-muted text-foreground-muted'
                          }`}>
                            <Icon size={20} />
                          </div>
                          <span className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {r.label}
                          </span>
                          <span className="text-[11px] text-foreground-muted text-center">{r.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-foreground-muted">
                    I agree to the{' '}
                    <Link to="#" className="text-primary hover:text-primary-dark">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="#" className="text-primary hover:text-primary-dark">Privacy Policy</Link>
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Social Sign In — only for login */}
            {mode === 'login' && (
              <>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-foreground-muted">or continue with</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-all duration-200 active:scale-[0.97] cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-sm">Google</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-all duration-200 active:scale-[0.97] cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-sm">Facebook</span>
                  </button>
                </div>
              </>
            )}

            {/* Bottom CTA */}
            <p className="mt-6 text-center text-sm text-foreground-muted">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="font-semibold text-primary hover:text-primary-dark transition-colors duration-200 cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="font-semibold text-primary hover:text-primary-dark transition-colors duration-200 cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>
        </div>

        {/* Guest mode */}
        <div className="mt-4 text-center">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors duration-200"
          >
            <ChefHat size={14} />
            Continue as guest
          </Link>
        </div>
      </div>
    </div>
  );
}