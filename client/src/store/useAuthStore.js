import { create } from "zustand";
import API from "../services/api";
import { socket } from "../lib/socket";

const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  onlineUsers: [],

  // CHECK AUTH
  checkAuth: async () => {
    try {
      const res = await API.get("/auth/check");
      set({ authUser: res.data });
      if (res.data?.token) {
        localStorage.setItem("konvo_token", res.data.token);
      }
      get().connectSocket();
    } catch {
      set({ authUser: null });
      localStorage.removeItem("konvo_token");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // SIGNUP
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const signupRes = await API.post("/auth/signup", data);
      if (signupRes.data?.token) {
        localStorage.setItem("konvo_token", signupRes.data.token);
      }
      const checkRes = await API.get("/auth/check");
      set({ authUser: checkRes.data });
      get().connectSocket();
      return { success: true };
    } catch (error) {
      set({ authUser: null });
      localStorage.removeItem("konvo_token");
      const message = error.response?.data?.message || "Signup failed";
      return { success: false, message };
    } finally {
      set({ isSigningUp: false });
    }
  },

  // LOGIN
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const loginRes = await API.post("/auth/login", data);
      if (loginRes.data?.token) {
        localStorage.setItem("konvo_token", loginRes.data.token);
      }
      const checkRes = await API.get("/auth/check");
      set({ authUser: checkRes.data });
      get().connectSocket();
      return { success: true };
    } catch (error) {
      set({ authUser: null });
      localStorage.removeItem("konvo_token");
      const message = error.response?.data?.message || "Login failed";
      return { success: false, message };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      await API.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem("konvo_token");
      get().disconnectSocket();
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // SOCKET CONNECT
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || socket.connected) return;

    socket.io.opts.query = { userId: authUser._id };
    socket.connect();

    // Remove before re-adding to prevent duplicate listeners
    socket.off("getOnlineUsers");
    socket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },

  // SOCKET DISCONNECT
  disconnectSocket: () => {
    if (socket.connected) {
      socket.off("getOnlineUsers"); // Clean up listener
      socket.disconnect();
    }
  },
}));

export default useAuthStore;
