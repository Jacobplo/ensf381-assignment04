import { Link, useNavigate } from "react-router-dom";

function Header() {
  const userId = localStorage.getItem("userId")

  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem("userId");
    navigate("/", { replace: true });
  }

  return (
    <>
      <header>
        <img src="/images/logo.webp" alt="Sweet Scoop" />
        <h1>Sweet Scoop Ice Cream Shop</h1> 
        {userId ? <button onClick={handleLogout}>Logout</button> : <></>}
      </header>

      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/flavors">Flavors</Link>
        {userId ? <button onClick={handleLogout}>Logout</button> : <Link to="/login">Login</Link>} 
        <Link to="/signup">Signup</Link>
        <Link to="/order_history">Order History</Link>
      </div>
    </>
  );
}

export default Header;
