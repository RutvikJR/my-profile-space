import { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom'; 

const Home = () => {

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();



  const handleLoginRedirect = () => {
    navigate('/login'); 
  };

  return (
    <div>
      <div className="m-2 text-xl font-semibold">Home</div>
      {authContext?.userId ? (
        <div className="m-2 text-xl font-semibold">User ID: {authContext.userId}</div>
      ) : (
        <button
          className="p-4 bg-cyan-600 text-white m-2 rounded-lg"
          onClick={handleLoginRedirect}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Home;
