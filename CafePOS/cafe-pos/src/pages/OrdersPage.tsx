import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../api/orders';
import { Link } from 'react-router-dom';
import type { OrderStatus } from '../types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery({ queryKey: ['orders'], queryFn: getOrders });

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading orders...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Order #', 'Date', 'Cashier', 'Items', 'Total', 'Status', 'Payment'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link to={`/orders/${order.id}`} className="font-medium text-amber-700 hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">{order.cashierName}</td>
                <td className="px-4 py-3">{order.items.length} item(s)</td>
                <td className="px-4 py-3 font-semibold">₱{order.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{order.payment?.method ?? '—'}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">No orders yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
