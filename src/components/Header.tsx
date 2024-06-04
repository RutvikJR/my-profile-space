import { Link, useNavigate } from "react-router-dom";
import { supabaseClient } from "../config/supabaseConfig";
import { showToast } from "../utils/toast";

const Header = () => {
  const navigate = useNavigate();
  const logoutUser = async () => {
    const res = await supabaseClient.auth.signOut();
    if (res.error) {
      showToast("Logging out failed", "error");
      console.log(res.error);
    } else {
      showToast("Logged out successfully", "success");
      navigate("/login");
    }
  };
  return (
    <nav className="flex justify-between items-center p-8">
      <h1 className="text-3xl font-bold">
        <Link to="/">My Profile Space</Link>
      </h1>
      <ul className="flex items-center justify-end gap-4">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <button
          onClick={logoutUser}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Log out
        </button>
      </ul>
    </nav>
  );
};

export default Header;
