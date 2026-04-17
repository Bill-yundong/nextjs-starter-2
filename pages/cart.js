import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export default function Cart() {
  const { state, dispatch } = useApp();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch({
      type: 'CART_UPDATE_QUANTITY',
      payload: { id: itemId, quantity: newQuantity }
    });
  };

  const handleRemoveItem = (itemId) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: itemId });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { type: 'info', message: 'Item removed from cart' }
    });
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      dispatch({ type: 'CART_CLEAR' });
    }
  };

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');

    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    // Mock promo codes
    const promoCodes = {
      'SAVE10': { discount: 10, type: 'percent' },
      'SAVE20': { discount: 20, type: 'percent' },
      'FLAT5': { discount: 5, type: 'fixed' },
      'FLAT10': { discount: 10, type: 'fixed' },
    };

    const promo = promoCodes[promoCode.toUpperCase()];
    if (!promo) {
      setPromoError('Invalid promo code');
      return;
    }

    let discountAmount;
    if (promo.type === 'percent') {
      discountAmount = (state.cart.totalPrice * promo.discount) / 100;
    } else {
      discountAmount = promo.discount;
    }

    dispatch({ type: 'CART_APPLY_DISCOUNT', payload: discountAmount });
    setPromoSuccess(`Promo code applied! You saved $${discountAmount.toFixed(2)}`);
    setPromoCode('');
  };

  if (state.cart.items.length === 0) {
    return (
      <>
        <Head>
          <title>Shopping Cart - Next.js Starter</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Looks like you haven&apos;t added any items yet.</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Shopping Cart - Next.js Starter</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {state.cart.totalQuantity} {state.cart.totalQuantity === 1 ? 'item' : 'items'}
                    </span>
                    <button
                      onClick={handleClearCart}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                {state.cart.items.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="p-6 border-b last:border-b-0 flex gap-4"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0">
                      {item.image && item.image.startsWith('http') ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <Image
                          src={item.image || '/images/helmet.jpg'}
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <Link href={`/product/${item.id}`}>
                          <a className="font-semibold text-lg hover:text-blue-600 cursor-pointer">
                            {item.name}
                          </a>
                        </Link>
                        <p className="font-bold text-lg">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {item.selectedSize && (
                        <p className="text-gray-600 text-sm mb-2">
                          Size: {item.selectedSize}
                        </p>
                      )}

                      <p className="text-gray-600 text-sm mb-3">
                        ${item.price} each
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-x">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link href="/">
                  <a className="inline-flex items-center text-blue-600 hover:text-blue-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </a>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-red-500 text-sm mt-1">{promoError}</p>
                  )}
                  {promoSuccess && (
                    <p className="text-green-600 text-sm mt-1">{promoSuccess}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Try: SAVE10, SAVE20, FLAT5, FLAT10
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${state.cart.totalPrice.toFixed(2)}</span>
                  </div>
                  {state.cart.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${state.cart.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${state.cart.finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout">
                  <a className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Proceed to Checkout
                  </a>
                </Link>

                <div className="mt-4 flex justify-center space-x-4 text-gray-400">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                  </svg>
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
