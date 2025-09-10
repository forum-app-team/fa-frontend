import { useState } from "react";
import AppRoutes from "./app/routes";
import { useAuth } from "@/features/auth/hooks/useAuth";

function App() {
  const { connectionStatus, error } = useAuth();

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
