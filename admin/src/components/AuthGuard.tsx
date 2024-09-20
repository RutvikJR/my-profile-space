import { Navigate } from "react-router-dom";
import userStore from "../store/userStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { id, isInitializing } = userStore();
  if (isInitializing) {
    return <div>Loading...</div>; // Or any loading spinner/component you prefer
  }

  if (!id) {
    return <Navigate to="/login" />;
  }
  return children;
}
