import React, { useEffect } from "react";
import OrderItem from "./OrderItem";

function OrderList({ order, setOrder, userId }) {
  const removeFromOrder = (id) => {
    fetch("http://localhost:5050/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: parseInt(userId), flavorId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder((prev) => prev.filter((i) => i.id !== id));
        }
      });
  };

  const totalPrice = order.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div className="order-list">
        {order.length === 0 && <p>No items in your order.</p>}
        {order.map((item) => (
          <OrderItem key={item.id} item={item} removeFromOrder={removeFromOrder} />
        ))}
        {order.length > 0 && <h4>Total: ${totalPrice.toFixed(2)}</h4>}
      </div>
    </>
  );
}

export default OrderList;
