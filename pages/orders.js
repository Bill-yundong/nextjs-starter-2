import Head from 'next/head';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Orders() {
  const { state } = useApp();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/login');
    }
  }, [state.isAuthenticated, router]);

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (state.orders.length === 0) {
    return (
      <>
        <Head>
          <title>My Orders - Next.js Starter</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <h1 className="text-2xl font-bold mb-4">No orders yet</h1>
            <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Head>
        <title>My Orders - Next.js Starter</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          <div className="space-y-6">
            {state.orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-wrap justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="font-bold">${order.totals.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {order.items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.selectedSize && (
                          <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                        )}
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}

                  <div className="border-t mt-4 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Subtotal</p>
                        <p className="font-medium">${order.totals.subtotal.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Discount</p>
                        <p className="font-medium text-green-600">
                          -${order.totals.discount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tax</p>
                        <p className="font-medium">${order.totals.tax.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total</p>
                        <p className="font-bold text-lg">${order.totals.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-gray-600">
                      {order.shipping.firstName} {order.shipping.lastName}<br />
                      {order.shipping.address}<br />
                      {order.shipping.city}, {order.shipping.postalCode}<br />
                      {order.shipping.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
