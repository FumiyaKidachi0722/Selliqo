'use client';

import { useEffect, useState } from 'react';

import { LogoutButton } from '@/components/molecules/LogoutButton';
import { useAuthStore } from '@/store/useAuthStore';

export default function UserDashboardPage() {
  const { isLoggedIn, checkAuthStatus, stripeCustomerId } = useAuthStore();
  const [orders, setOrders] = useState<
    {
      id: string;
      amount: number;
      currency: string | null;
      status: string;
      items: { name: string; quantity: number }[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!isLoggedIn) {
        setError('Please log in to view your dashboard.');
        setLoading(false);
        return;
      }

      if (!stripeCustomerId) {
        setError('Missing Stripe customer ID. Please contact support.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stripeCustomerId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isLoggedIn, stripeCustomerId]);

  if (!isLoggedIn) {
    return <p>Please log in to view your dashboard.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      <h2>Your Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <p>Order #{order.id}</p>
            <p>
              Amount: {order.amount}{' '}
              {order.currency ? order.currency.toUpperCase() : 'N/A'}
            </p>
            <p>Status: {order.status}</p>
          </li>
        ))}
      </ul>
      <LogoutButton />
    </div>
  );
}
