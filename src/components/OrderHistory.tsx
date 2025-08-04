import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, DocumentData } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

interface Order {
  id: string;
  createdAt: Timestamp;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
}

interface OrderHistoryProps {
  userId: string;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const q = query(collection(db, "orders"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        fetchedOrders.push({
          id: doc.id,
          createdAt: data.createdAt,
          items: data.items,
          totalPrice: data.totalPrice,
        });
      });
      // Sort by most recent
      fetchedOrders.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      setOrders(fetchedOrders);
      setLoading(false);
    };
    if (userId) fetchOrders();
  }, [userId]);

  if (loading) return <div>Loading order history...</div>;
  if (!orders.length) return <div>No orders found.</div>;

  return (
    <div>
      <h2>Order History</h2>
      <ul>
        {orders.map((order) => (
          <li
            key={order.id}
            style={{ cursor: "pointer", marginBottom: "1em", border: "1px solid #ccc", padding: "1em" }}
            onClick={() => setSelectedOrder(order)}
          >
            <strong>Order ID:</strong> {order.id}<br />
            <strong>Items:</strong>{order.items.map(item => item.name).join(", ")}<br />
            <strong>Date:</strong> {order.createdAt.toDate().toLocaleString()}<br />
            <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
          </li>
        ))}
      </ul>
      {selectedOrder && (
        <div style={{ border: "1px solid #333", padding: "1em", marginTop: "1em" }}>
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> {selectedOrder.id}</p>
          <p><strong>Date:</strong> {selectedOrder.createdAt.toDate().toLocaleString()}</p>
          <p><strong>Items: </strong></p>{selectedOrder.items.map(item => item.name).join(", ")}
          <p><strong>Total Price:</strong> ${selectedOrder.totalPrice.toFixed(2)}</p>
          <h4>Products:</h4>
          <ul>
            {selectedOrder.items.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity}
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedOrder(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;