import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

import useAuthStore from "./store/useAuthStore";

import { useEffect } from "react";

function App() {
  const {
    authUser,
    checkAuth,
    isCheckingAuth,
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

 if (isCheckingAuth) {
  return (
    <div className="h-screen flex items-center justify-center">
      Checking session...
    </div>
  );
}

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <Home />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/login"
          element={
            !authUser ? (
              <Login />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !authUser ? (
              <Signup />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;