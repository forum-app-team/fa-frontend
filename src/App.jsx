import AppRoutes from "./app/routes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./features/auth/store/auth.slice";
import { refreshClient } from "./libs/axios";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await refreshClient.post("", {}, {
          withCredentials: true, // send refresh cookie
        });
        console.warn(data);
        if (data?.accessToken) {
          dispatch(loginSuccess(data));
        } else {
          dispatch(logout(data));
        }
      } catch (error) {
        console.warn(error);
        dispatch(logout({ message: error.message }));
      }
    })();
  }, [dispatch]);
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
