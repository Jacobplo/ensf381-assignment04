import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FlavorCatalog from "../components/FlavorCatalog";
import OrderList from "../components/OrderList";
import { useNavigate } from "react-router-dom";

function FlavorsPage() {
  const [order, setOrder] = useState([]);
  const [status, setStatus] = useState(null); 

  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  // Load cart from backend on page load
  useEffect(() => { 
    if (!userId) {
      setStatus({ type: "error", message: "You must be logged in to view order history." });
      navigate("/login", { replace: true });
      return;
    }

    fetch(`http://localhost:5050/cart?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const cartAsOrder = data.cart.map((item) => ({
            id: item.flavorId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }));
          setOrder(cartAsOrder);
          setStatus({type: "success", message: "Successfully loaded cart"})
        }
        else {
          setStatus({ type: "error", message: data.message})
        }
      }).catch(() => {
        setStatus({ type: "error", message: "Could not connect to server." });
      });
  }, []);

  const addToOrder = (flavor) => {
    const existing = order.find((item) => item.id === flavor.id);
    if (existing) {
      // Update quantity in backend
      fetch("http://localhost:5050/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parseInt(userId), flavorId: flavor.id, quantity: existing.quantity + 1 }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrder((prev) =>
              prev.map((item) =>
                item.id === flavor.id ? { ...item, quantity: item.quantity + 1 } : item
              )
            );
          }
        });
    } else {
      // Add to backend cart
      fetch("http://localhost:5050/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parseInt(userId), flavorId: flavor.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrder((prev) => [...prev, { id: flavor.id, name: flavor.name, price: flavor.price, quantity: 1 }]);
          }
        });
    }
  };

  const placeOrder = () => {
    if (!userId || order.length === 0) return;
    fetch("http://localhost:5050/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: parseInt(userId) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder([]);
          alert("Order placed successfully!");
        } else {
          alert(data.message);
        }
      });
  };

  return (
    <div className="flavors-page">
      <Header />
      <div className="content"> 
        <FlavorCatalog addToOrder={addToOrder} />

        <h3>Your Order</h3>
        {status && (
          <p style={{ color: status.type === "error" ? "red" : "green" }}>
            {status.message}
          </p>
        )}
        <OrderList order={order} setOrder={setOrder} userId={userId} />
        {order.length > 0 && (
          <button onClick={placeOrder}>Place Order</button>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default FlavorsPage;
