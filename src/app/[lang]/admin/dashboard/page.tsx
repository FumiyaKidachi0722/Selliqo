'use client';

import { useEffect, useState } from 'react';

import { LogoutButton } from '@/components/molecules/LogoutButton';
import { fetchAllOrders } from '@/services/adminService';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminDashboardPage() {
  const { isLoggedIn, role, checkAuthStatus } = useAuthStore();
  const [orders, setOrders] = useState<{ id: number; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 初期化時に認証状態をチェック
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!isLoggedIn || role !== '0') {
        setError('Access denied. Admins only.');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isLoggedIn, role]);

  if (!isLoggedIn || role !== '0') {
    return <p>Access denied. Admins only.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>All Orders</h2>
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
