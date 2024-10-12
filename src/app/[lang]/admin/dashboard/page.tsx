'use client';

import { useEffect, useState } from 'react';

import { fetchAllOrders } from '@/services/adminService';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminDashboardPage() {
  const { isLoggedIn, role } = useAuthStore();
  const [orders, setOrders] = useState<{ id: number; status: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (!isLoggedIn || role !== '0') {
    return <p>Access denied. Admins only.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
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
    </div>
  );
}
