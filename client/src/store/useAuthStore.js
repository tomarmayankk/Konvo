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
      get().connectSocket();
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // SIGNUP
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await API.post("/auth/signup", data);
      set({ authUser: res.data });
      get().connectSocket();
      return { success: true };
    } catch (error) {
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
      const res = await API.post("/auth/login", data);
      set({ authUser: res.data });
      get().connectSocket();
      return { success: true };
    } catch (error) {
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