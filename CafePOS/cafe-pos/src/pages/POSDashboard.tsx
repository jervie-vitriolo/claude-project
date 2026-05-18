import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories } from '../api/categories';
import { getProducts } from '../api/products';
import { createOrder, processPayment } from '../api/orders';
import { useCartStore } from '../store/cartStore';
import { Minus, Plus, Trash2, ShoppingCart, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { PaymentMethod } from '../types';

const PAYMENT_METHODS: { label: string; value: number; key: PaymentMethod }[] = [
  { label: 'Cash', value: 0, key: 'Cash' },
  { label: 'Card', value: 1, key: 'Card' },
  { label: 'GCash', value: 2, key: 'GCash' },
];

export default function POSDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<{ orderNumber: string; total: number; method: string } | null>(null);

  const { items, addItem, removeItem, updateQty, clearCart, total } = useCartStore();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const { data: products = [] } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => getProducts(selectedCategory ?? undefined),
  });

  const orderMutation = useMutation({
    mutationFn: async () => {
      const order = await createOrder({ items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })) });
      const paid = await processPayment(order.id, { orderId: order.id, method: paymentMethod, amount: total() });
      return paid;
    },
    onSuccess: (order) => {
      setLastOrder({ orderNumber: order.orderNumber, total: order.totalAmount, method: PAYMENT_METHODS[paymentMethod].key });
      clearCart();
      setShowCheckout(false);
      setShowReceipt(true);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => toast.error('Payment failed. Please try again.'),
  });

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Product section */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Category tabs */}
        <div className="flex gap-2 px-4 py-3 bg-white border-b overflow-x-auto shrink-0">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === null ? 'bg-amber-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === cat.id ? 'bg-amber-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 content-start">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => addItem({ productId: product.id, productName: product.name, price: product.price })}
              className="bg-white rounded-xl border hover:border-amber-400 hover:shadow-md transition-all p-4 text-left group"
            >
              <div className="w-full aspect-square bg-amber-50 rounded-lg mb-3 flex items-center justify-center text-3xl">
                ☕
              </div>
              <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
              <p className="text-amber-700 font-bold text-sm mt-1">₱{product.price.toFixed(2)}</p>
            </button>
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-16">No products available</div>
          )}
        </div>
      </div>

      {/* Cart sidebar */}
      <div className="w-80 bg-white border-l flex flex-col shadow-lg">
        <div className="flex items-center gap-2 px-4 py-3 border-b font-semibold text-gray-800">
          <ShoppingCart size={18} /> Order
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {items.length === 0 && (
            <p className="text-gray-400 text-sm text-center mt-8">Add items to get started</p>
          )}
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 py-3 border-b last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                <p className="text-xs text-amber-700">₱{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="p-1 rounded hover:bg-gray-100">
                  <Minus size={13} />
                </button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="p-1 rounded hover:bg-gray-100">
                  <Plus size={13} />
                </button>
              </div>
              <p className="text-sm font-semibold w-16 text-right">₱{(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t p-4">
          <div className="flex justify-between text-lg font-bold mb-3">
            <span>Total</span>
            <span className="text-amber-800">₱{total().toFixed(2)}</span>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            disabled={items.length === 0}
            className="w-full bg-amber-800 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Checkout
          </button>
          {items.length > 0 && (
            <button onClick={clearCart} className="w-full mt-2 text-gray-400 hover:text-red-500 text-sm transition-colors">
              Clear cart
            </button>
          )}
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Checkout</h2>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 bg-gray-50 rounded-lg p-3 text-sm space-y-1 max-h-36 overflow-y-auto">
              {items.map((i) => (
                <div key={i.productId} className="flex justify-between">
                  <span>{i.productName} x{i.quantity}</span>
                  <span>₱{(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-lg mb-5">
              <span>Total</span>
              <span className="text-amber-800">₱{total().toFixed(2)}</span>
            </div>

            <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
            <div className="flex gap-2 mb-6">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setPaymentMethod(m.value)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${paymentMethod === m.value ? 'bg-amber-800 text-white border-amber-800' : 'border-gray-300 hover:border-amber-400'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => orderMutation.mutate()}
              disabled={orderMutation.isPending}
              className="w-full bg-amber-800 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {orderMutation.isPending ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      )}

      {/* Receipt modal */}
      {showReceipt && lastOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-80 shadow-xl text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Payment Successful!</h2>
            <p className="text-gray-500 text-sm mb-4">Order {lastOrder.orderNumber}</p>
            <div className="bg-amber-50 rounded-lg p-4 mb-6">
              <p className="text-3xl font-bold text-amber-800">₱{lastOrder.total.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">Paid via {lastOrder.method}</p>
            </div>
            <button
              onClick={() => setShowReceipt(false)}
              className="w-full bg-amber-800 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              New Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
