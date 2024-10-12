'use client';

import { useEffect, useState } from 'react';

import { fetchUserOrders } from '@/services/userService';
import { useAuthStore } from '@/store/useAuthStore';

export default function UserDashboardPage() {
  const { isLoggedIn } = useAuthStore();
  const [orders, setOrders] = useState<{ id: number; status: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchUserOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (!isLoggedIn) {
    return <p>Please log in to view your dashboard.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
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
    </div>
  );
}
