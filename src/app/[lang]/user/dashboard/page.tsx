'use client';

import { useEffect, useState } from 'react';

import { LogoutButton } from '@/components/molecules/LogoutButton';
import { fetchUserOrders } from '@/services/userService';
import { useAuthStore } from '@/store/useAuthStore';

export default function UserDashboardPage() {
  const { isLoggedIn, checkAuthStatus } = useAuthStore();
  const [orders, setOrders] = useState<{ id: number; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 初期化時に認証状態を確認
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!isLoggedIn) {
        setError('Please log in to view your dashboard.');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchUserOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isLoggedIn]);

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
            Order #{order.id} - {order.status}
          </li>
        ))}
      </ul>
      <LogoutButton />
    </div>
  );
}
