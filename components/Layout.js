import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const { state, dispatch } = useApp();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { type: 'info', message: 'You have been logged out' }
    });
  };

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  // Auto-dismiss notifications after 3 seconds
  useEffect(() => {
    if (state.notifications.length === 0) return;

    const timers = state.notifications.map((notification) => {
      return setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
      }, 3000);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [state.notifications, dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {state.notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded shadow-lg flex items-center justify-between min-w-[300px] animate-fade-in ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              notification.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-white hover:text-gray-200 text-xl leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <a className="text-xl font-bold text-blue-600">
                Next.js Starter
              </a>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/">
                <a className="text-gray-600 hover:text-blue-600">Products</a>
              </Link>
              
              {state.isAuthenticated && (
                <Link href="/orders">
                  <a className="text-gray-600 hover:text-blue-600">My Orders</a>
                </Link>
              )}

              {/* Cart */}
              <Link href="/cart">
                <a className="relative text-gray-600 hover:text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {mounted && state.cart.totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {state.cart.totalQuantity}
                    </span>
                  )}
                </a>
              </Link>

              {/* Auth */}
              {state.isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    Hi, {state.user?.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login">
                    <a className="text-gray-600 hover:text-blue-600">Login</a>
                  </Link>
                  <Link href="/register">
                    <a className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                      Sign Up
                    </a>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link href="/">
                  <a className="text-gray-600 hover:text-blue-600">Products</a>
                </Link>
                <Link href="/cart">
                  <a className="text-gray-600 hover:text-blue-600">
                    Cart ({mounted ? state.cart.totalQuantity : 0})
                  </a>
                </Link>
                {state.isAuthenticated && (
                  <Link href="/orders">
                    <a className="text-gray-600 hover:text-blue-600">My Orders</a>
                  </Link>
                )}
                {state.isAuthenticated ? (
                  <>
                    <span className="text-gray-600">
                      Hi, {state.user?.firstName}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-left text-gray-600 hover:text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <a className="text-gray-600 hover:text-blue-600">Login</a>
                    </Link>
                    <Link href="/register">
                      <a className="text-gray-600 hover:text-blue-600">Sign Up</a>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Next.js Starter</h3>
              <p className="text-gray-400">
                Your one-stop shop for quality products.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/"><a className="hover:text-white">All Products</a></Link></li>
                <li><Link href="/?category=1"><a className="hover:text-white">Gear</a></Link></li>
                <li><Link href="/?category=2"><a className="hover:text-white">Clothing</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/cart"><a className="hover:text-white">Cart</a></Link></li>
                <li><Link href="/orders"><a className="hover:text-white">My Orders</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact"><a className="hover:text-white">Contact Us</a></Link></li>
                <li><Link href="/faq"><a className="hover:text-white">FAQ</a></Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Next.js Starter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
