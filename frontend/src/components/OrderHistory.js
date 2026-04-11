import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState(null);

  const navigate = useNavigate()

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setStatus({ type: "error", message: "You must be logged in to view order history." });
      navigate("/login", { replace: true });
    }

    fetch(`http://localhost:5050/orders?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        } else {
          setStatus({ type: "error", message: data.message });
        }
      })
      .catch(() => {
        setStatus({ type: "error", message: "Could not connect to server." });
      });
  }, []);

  return (
    <div className="content">
      <h2>Order History</h2>
      {status && (
        <p style={{ color: status.type === "error" ? "red" : "green" }}>
          {status.message}
        </p>
      )}
      {orders.length === 0 && !status && (
        <p>You have not placed any orders yet.</p>
      )}
      {orders.map((order) => (
        <div className="order-list" key={order.orderId} style={{ marginBottom: "20px" }}>
          <p><em>Order #{order.orderId}</em></p>
          <p>{order.timestamp}</p>
          {order.items.map((item) => (
            <p key={item.flavorId}>
              {item.name} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
            </p>
          ))}
          <p><strong>Total: ${order.total.toFixed(2)}</strong></p>
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;
