import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlavorItem from "./FlavorItem";

function FlavorCatalog({ addToOrder }) {
  const [flavors, setFlavors] = useState([]);
  const [message, setMessage] = useState(""); 
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  useEffect(() => {     
    if (!userId) {
      setMessage({ message: "You must be logged in to view order history." });
      navigate("/login", { replace: true });
    }

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
        setMessage(data.message);
        setFlavors(data.flavors);
      })
      .catch(error => setMessage(error.message))
  }, [userId])
  
  return (
    <>
      <h2>Ice Cream Flavors</h2>
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
