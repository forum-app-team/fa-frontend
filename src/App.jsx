import AppRoutes from "./app/routes";
import { useAuth } from "@/features/auth/hooks/useAuth";

function App() {
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
