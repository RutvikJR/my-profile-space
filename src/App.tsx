import "./App.css";
import AppRoutes from "./AppRoutes";
import AppWrapper from "./pages/AppWrapper";
import { AuthProvider } from "./utils/AuthContext"
function App() {
  return (
    <>
      <AuthProvider>
      <AppWrapper>
        <AppRoutes>
        </AppRoutes>
      </AppWrapper>
      </AuthProvider>
    </>
  );
}

export default App;
