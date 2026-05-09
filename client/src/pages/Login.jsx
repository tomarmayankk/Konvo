import { useState } from "react";

import useAuthStore from "../store/useAuthStore";

import { Link } from "react-router-dom";

export default function Login() {
  const { login, isLoggingIn } =
    useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(formData);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-md"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-md"
          value={formData.password}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
        />

        <button
          className="bg-black text-white py-3 rounded-md"
          disabled={isLoggingIn}
        >
          {isLoggingIn
            ? "Loading..."
            : "Login"}
        </button>

        <p className="text-center">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}