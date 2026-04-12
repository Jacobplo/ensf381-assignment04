import { useState, useEffect } from "react";
import FlavorItem from "./FlavorItem";

function FlavorCatalog({ addToOrder }) {
  const [flavors, setFlavors] = useState([]);
  const [status, setStatus] = useState(null);  

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) return;

    fetch("http://127.0.0.1:5050/flavors", { method: "GET" })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        else {
          throw new Error("Failed to get flavors");
        }
      })
      .then(data => {
        if (data.success) {

        }
        setStatus({success: data.success, message: data.message});
        setFlavors(data.flavors);
      })
      .catch(error => setStatus({success: false, message: "Could not connect to server."}))
  }, []) 
  
  return (
    <>
      <h2>Ice Cream Flavors</h2>
      {status && (
        <p style={{ color: status.success === false ? "red" : "green" }}>
          {status.message}
        </p>
      )}
      <div className="flavor-grid">
        {flavors.map(f => (
          <FlavorItem
            key={f.id}
            flavor={f}
            addToOrder={addToOrder}
          />
        ))}

      </div>
    </>
  )

}

export default FlavorCatalog;
