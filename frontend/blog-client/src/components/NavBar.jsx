import { Link } from "react-router";

function NavBar() {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/Login">Login</Link>
    </div>
  );
}

export default NavBar;
