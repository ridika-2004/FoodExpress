import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, ChefHat, Bike, UserCircle, Store, KeyRound, Check, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../data/mockData';

type AuthMode = 'login' | 'register';

const roles: { value: UserRole; label: string; icon: typeof UserCircle; desc: string }[] = [
  { value: 'user', label: 'Customer', icon: UserCircle, desc: 'Order delicious food' },
  { value: 'deliveryman', label: 'Delivery Partner', icon: Bike, desc: 'Deliver orders & earn' },
  { value: 'restaurant', label: 'Restaurant', icon: Store, desc: 'Manage your restaurant & menu' },
];

// ─── Password strength ────────────────────────────────
type PasswordChecks = Record<'length' | 'upper' | 'lower' | 'number' | 'special', boolean>;

const passwordRules: { key: keyof PasswordChecks; label: string }[] = [
  { key: 'length', label: '8+ characters' },
  { key: 'upper', label: 'uppercase letter (A-Z)' },
  { key: 'lower', label: 'lowercase letter (a-z)' },
  { key: 'number', label: 'number (0-9)' },
  { key: 'special', label: 'special character (!@#$…)' },
];

function checkPassword(pw: string): PasswordChecks {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /\d/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
}

function strengthMeta(score: number) {
  if (score <= 1) return { label: 'Weak', bar: 'bg-red-500', text: 'text-red-600' };
  if (score <= 3) return { label: 'Fair', bar: 'bg-amber-500', text: 'text-amber-600' };
  if (score === 4) return { label: 'Good', bar: 'bg-lime-500', text: 'text-lime-600' };
  return { label: 'Strong', bar: 'bg-green-500', text: 'text-green-600' };
}

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
  const [secretCode, setSecretCode] = useState('');

  const regChecks = checkPassword(regPassword);
  const regScore = Object.values(regChecks).filter(Boolean).length;
  const strength = strengthMeta(regScore);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && selectedRole !== 'user' && !secretCode.trim()) {
      setError(`Enter the secret code to join as a ${selectedRole === 'restaurant' ? 'restaurant owner' : 'delivery partner'}`);
      return;
    }

    // Password strength check before submit
    if (mode === 'register') {
      const checks = checkPassword(regPassword);
      const missing = passwordRules.filter(r => !checks[r.key]).map(r => r.label);
      if (missing.length > 0) {
        setError(`Password must include: ${missing.join(', ')}.`);
        return;
      }
    }

    setIsLoading(true);

    if (mode === 'login') {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error ?? 'Invalid email or password');
      }
    } else {
      const result = await register(name, regEmail, phone, regPassword, secretCode);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error ?? 'Registration failed. Please try again.');
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
                      placeholder="8+ characters with letters, numbers & symbols"
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

                  {/* Strength meter + checklist */}
                  {regPassword && (
                    <div className="mt-3">
                      {/* Meter bars */}
                      <div className="flex gap-1" aria-hidden="true">
                        {[0, 1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                              i < regScore ? strength.bar : 'bg-border'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`mt-1 text-xs font-semibold ${strength.text}`}>
                        Password strength: {strength.label}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {passwordRules.map(rule => {
                          const ok = regChecks[rule.key];
                          return (
                            <li
                              key={rule.key}
                              className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
                                ok ? 'text-green-600 font-medium' : 'text-foreground-muted'
                              }`}
                            >
                              {ok ? (
                                <Check size={12} className="shrink-0" />
                              ) : (
                                <Circle size={12} className="shrink-0 text-foreground-muted/60" />
                              )}
                              {rule.label}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
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

                {/* Secret Code (for Restaurant / Delivery Partner) */}
                {selectedRole !== 'user' && (
                  <div>
                    <label htmlFor="secret-code" className="block text-sm font-medium text-foreground mb-1.5">
                      Secret Code
                    </label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                      <input
                        id="secret-code"
                        type="password"
                        value={secretCode}
                        onChange={e => setSecretCode(e.target.value)}
                        placeholder={selectedRole === 'restaurant' ? 'Enter restaurant secret code' : 'Enter delivery secret code'}
                        className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                      />
                    </div>
                    <p className="text-xs text-foreground-muted mt-1.5">
                      {selectedRole === 'restaurant'
                        ? <>Use the secret code <strong className="text-primary">"restaurant"</strong> to join as a restaurant owner</>
                        : <>Use the secret code <strong className="text-primary">"delivery"</strong> to join as a delivery partner</>}
                    </p>
                  </div>
                )}

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
      </div>
    </div>
  );
}