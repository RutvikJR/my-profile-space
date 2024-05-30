import { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthContext } from '../utils/AuthContext';

const Layout = () => {
  const authContext = useContext(AuthContext);

  return (
    <>
      <nav className="bg-theme3 text-theme1 flex justify-between">
        <ul className="flex px-5 py-5">
          <li className="px-3 text-xl">
            <Link to="/">Home</Link>
          </li>

          <li className="px-3 text-xl">
            <Link to="/contact">Contact</Link>
          </li>
          {authContext?.userId ? (
            <>
              <li className="px-3 text-xl">
                <LogOut />
              </li>
            </>
          ) : (
            <>
            </>
          )}
        </ul>

        <div className="flex mx-8">
          <button className="bg-theme1 text-theme3 my-4 px-6 rounded flex items-center space-x-1">
            <i className="fas fa-plus"></i>
            <span>Add Section</span>
          </button>
        </div>
      </nav>
      <Outlet />
      <footer className="bg-theme3 text-theme1 py-5">
        <p className="flex mx-auto">footer here</p>
      </footer>
    </>
  );
};

const LogOut = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    authContext?.setUserId(null);
  };

  return (
    <button
      onClick={handleLogout}
      className="p bg-cyan-600 text-white rounded-lg hover:bg-cyan-900"
    >
      Logout
    </button>
  );
};

export default Layout;
