import React from "react";
import flavors from "../data/flavors";
import FlavorItem from "./FlavorItem";

function FlavorCatalog({ addToOrder }) {
const userId = localStorage.getItem("userId");
console.log("userId:", userId);
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
