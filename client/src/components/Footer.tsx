import { Link } from 'react-router-dom';
import { env } from '../constants/env';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold">
                Food<span className="text-primary">Express</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Your favorite food, delivered fast. From local restaurants to your doorstep in minutes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white/90 mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {['Home', 'Restaurants', 'My Orders', 'About Us'].map(link => (
                <li key={link}>
                  <Link
                    to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-white/60 hover:text-primary transition-colors duration-200"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white/90 mb-4 uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'Refund Policy'].map(link => (
                <li key={link}>
                  <Link
                    to="#"
                    className="text-sm text-white/60 hover:text-primary transition-colors duration-200"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white/90 mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>{env.SUPPORT_EMAIL}</li>
              <li>{env.SUPPORT_PHONE}</li>
              <li className="text-white/40 text-xs mt-3">Available 24/7 for support</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} FoodExpress. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}