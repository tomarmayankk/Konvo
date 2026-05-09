import { useState } from "react";

import useAuthStore from "../store/useAuthStore";

import { Link } from "react-router-dom";

export default function Signup() {
  const { signup, isSigningUp } =
    useAuthStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(formData);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center">
          Signup
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="border p-3 rounded-md"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({
              ...formData,
              fullName: e.target.value,
            })
          }
        />

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
          disabled={isSigningUp}
        >
          {isSigningUp
            ? "Loading..."
            : "Create Account"}
        </button>

        <p className="text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}