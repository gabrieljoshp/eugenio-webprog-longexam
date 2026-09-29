import { useEffect, useState } from "react";
import { fetchOrders } from "../services/OrderService";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetchOrders()
      .then(({ data }) => setOrders(data.data || []))
      .catch(() => setError("Unable to load orders."));
  }, []);
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
        Customer account
      </p>
      <h1 className="mt-2 text-4xl font-bold">Order ongoing</h1>
      {error && (
        <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="mt-8 grid gap-4">
        {orders.length ? (
          orders.map((order) => (
            <article
              key={order._id}
              className="border-2 border-zinc-900 bg-white p-5"
            >
              <div className="flex flex-wrap justify-between gap-3">
                <strong>#{order.orderNumber}</strong>
                <span className="rounded-full bg-yellow-300 px-3 py-1 text-xs font-bold uppercase">
                  {order.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-zinc-600">
                {order.items?.length || 0} item(s) · ₱
                {order.total?.toFixed?.(2) || order.total}
              </p>
            </article>
          ))
        ) : (
          <p className="border border-dashed border-zinc-400 p-6 text-zinc-600">
            No orders yet.
          </p>
        )}
      </div>
    </main>
  );
};

export default OrdersPage;
