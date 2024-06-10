import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AppRoutes from "./AppRoutes";
import '@mantine/dates/styles.css';

function App() {
  return (
    <>
      <AppRoutes></AppRoutes>
      <ToastContainer />
    </>
  );
}

export default App;
