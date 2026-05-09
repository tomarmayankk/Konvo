import { create } from "zustand";

import API from "../services/api";

import useAuthStore from "./useAuthStore";

const useChatStore = create((set, get) => ({

  // FRIENDS

  friends: [],

  friendRequests: [],

  searchResults: [],

  searchQuery: "",


  // CHAT

  messages: [],

  selectedUser: null,


  // LOADING

  isFriendsLoading: false,

  isMessagesLoading: false,

  isSendingRequest: false,
  isNotificationOpen: false,
  activeTab: "chat",


  // GET FRIENDS

  getFriends: async () => {
    set({
      isFriendsLoading: true,
    });

    try {
      const res = await API.get(
        "/users/friends"
      );

      set({
        friends: res.data,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({
        isFriendsLoading: false,
      });
    }
  },


  // GET FRIEND REQUESTS

  getFriendRequests: async () => {
    try {
      const res = await API.get(
        "/users/friend-requests"
      );

      set({
        friendRequests: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  },


  // SEARCH USERS

  searchUsers: async (query) => {
    set({
      searchQuery: query,
    });

    if (!query.trim()) {
      set({
        searchResults: [],
      });

      return;
    }

    try {
      const res = await API.get(
        `/users/search?q=${query}`
      );

      set({
        searchResults: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  },


  // SEND FRIEND REQUEST

  sendFriendRequest: async (
    userId
  ) => {
    set({
      isSendingRequest: true,
    });

    try {
      await API.post(
        `/users/send-request/${userId}`
      );

      // REMOVE FROM SEARCH RESULTS

      set({
        searchResults:
          get().searchResults.filter(
            (user) =>
              user._id !== userId
          ),
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({
        isSendingRequest: false,
      });
    }
  },


  // ACCEPT FRIEND REQUEST

  acceptFriendRequest: async (
    senderId
  ) => {
    try {
      await API.post(
        `/users/accept-request/${senderId}`
      );

      // REFRESH DATA

      get().getFriendRequests();

      get().getFriends();
    } catch (error) {
      console.log(error);
    }
  },


  // REJECT FRIEND REQUEST

  rejectFriendRequest: async (
    senderId
  ) => {
    try {
      await API.post(
        `/users/reject-request/${senderId}`
      );

      get().getFriendRequests();
    } catch (error) {
      console.log(error);
    }
  },


  // GET MESSAGES

  getMessages: async (userId) => {
    set({
      isMessagesLoading: true,
    });

    try {
      const res = await API.get(
        `/messages/${userId}`
      );

      set({
        messages: res.data,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({
        isMessagesLoading: false,
      });
    }
  },


  // SEND MESSAGE

  sendMessage: async (text) => {
    const {
      selectedUser,
      messages,
    } = get();

    try {
      const res = await API.post(
        `/messages/send/${selectedUser._id}`,
        { text }
      );

      set({
        messages: [
          ...messages,
          res.data,
        ],
      });
    } catch (error) {
      console.log(error);
    }
  },


  // SOCKET SUBSCRIBE

  subscribeToMessages: () => {
    const socket =
      useAuthStore.getState().socket;

    if (!socket) return;

    socket.off("newMessage");

    socket.on(
      "newMessage",
      (newMessage) => {
        const { selectedUser } =
          get();

        if (
          selectedUser?._id !==
          newMessage.senderId
        ) {
          return;
        }

        set({
          messages: [
            ...get().messages,
            newMessage,
          ],
        });
      }
    );
  },


  // SOCKET UNSUBSCRIBE

  unsubscribeFromMessages: () => {
    const socket =
      useAuthStore.getState().socket;

    if (!socket) return;

    socket.off("newMessage");
  },

  toggleNotifications: () =>
  set((state) => ({
    isNotificationOpen:
      !state.isNotificationOpen,
  })),

  setActiveTab: (tab) =>
  set({
    activeTab: tab,
  }),

  // SELECT USER

  setSelectedUser: (
    selectedUser
  ) =>
    set({
      selectedUser,
    }),
}));

export default useChatStore;