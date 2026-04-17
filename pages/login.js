import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { dispatch } = useApp();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    dispatch({ type: 'AUTH_START' });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful login
    const mockUser = {
      id: '123',
      email: formData.email,
      firstName: 'John',
      lastName: 'Doe',
      avatar: null,
    };

    dispatch({ type: 'AUTH_SUCCESS', payload: mockUser });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { type: 'success', message: 'Welcome back!' }
    });

    setIsLoading(false);
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Login - Next.js Starter</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="/forgot-password">
                  <a className="text-sm text-blue-600 hover:text-blue-800">Forgot password?</a>
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register">
                  <a className="text-blue-600 hover:text-blue-800 font-semibold">Sign up</a>
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500 text-center mb-4">Demo credentials:</p>
              <p className="text-sm text-gray-500 text-center">Email: any email</p>
              <p className="text-sm text-gray-500 text-center">Password: any password (min 6 chars)</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
