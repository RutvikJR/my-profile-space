import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
      <Outlet></Outlet>
      <footer>
        <p>footer here</p>
      </footer>
    </>
  );
};

export default Layout;
