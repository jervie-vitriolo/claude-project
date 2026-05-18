import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../api/orders';
import { ArrowLeft } from 'lucide-react';
import type { OrderStatus } from '../types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery({ queryKey: ['order', id], queryFn: () => getOrder(Number(id)) });

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading...</div>;
  if (!order) return <div className="p-8 text-center text-red-500">Order not found</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to="/orders" className="flex items-center gap-1 text-amber-700 hover:underline mb-4 text-sm">
        <ArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{order.orderNumber}</h1>
            <p className="text-gray-400 text-sm mt-1">{new Date(order.createdAt).toLocaleString()}</p>
            <p className="text-gray-500 text-sm">Cashier: {order.cashierName}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>
            {order.status}
          </span>
        </div>

        <h2 className="font-semibold text-gray-700 mb-3">Items</h2>
        <div className="border rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Product', 'Qty', 'Unit Price', 'Subtotal'].map((h) => (
                  <th key={h} className="text-left px-4 py-2 font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.productName}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">₱{item.unitPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 font-medium">₱{item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
          <span>Total</span>
          <span className="text-amber-800">₱{order.totalAmount.toFixed(2)}</span>
        </div>

        {order.payment && (
          <div className="mt-4 bg-green-50 rounded-lg p-4 text-sm">
            <p className="font-medium text-green-700">Payment Received</p>
            <p className="text-gray-600">Method: {order.payment.method}</p>
            <p className="text-gray-600">Amount: ₱{order.payment.amount.toFixed(2)}</p>
            <p className="text-gray-500">Paid at: {new Date(order.payment.paidAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
