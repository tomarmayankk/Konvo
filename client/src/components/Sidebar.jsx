import { useEffect } from "react";

import useChatStore from "../store/useChatStore";

import useAuthStore from "../store/useAuthStore";

export default function Sidebar() {
  const {
    friends,
    friendRequests,

    selectedUser,
    setSelectedUser,

    getFriends,
    getFriendRequests,

    searchUsers,
    searchResults,
    searchQuery,

    sendFriendRequest,

    acceptFriendRequest,
    rejectFriendRequest,
  } = useChatStore();

  const { onlineUsers } =
    useAuthStore();

  useEffect(() => {
    getFriends();

    getFriendRequests();
  }, []);

  return (
    <div className="w-[350px] border-r h-full overflow-y-auto bg-white">


      {/* HEADER */}

      <div className="p-5 border-b sticky top-0 bg-white z-10">
        <h1 className="text-3xl font-bold">
          Konvo
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Real-time messaging
        </p>


        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search users..."
          className="w-full mt-4 border rounded-full px-4 py-3 outline-none"
          value={searchQuery}
          onChange={(e) =>
            searchUsers(e.target.value)
          }
        />
      </div>


      {/* SEARCH RESULTS */}

      {searchQuery && (
        <div>
          <div className="px-4 py-2 text-sm font-semibold text-gray-500">
            Search Results
          </div>

          {searchResults.map((user) => (
            <div
              key={user._id}
              className="p-4 border-b flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  {user.fullName[0]}
                </div>

                <div>
                  <p className="font-medium">
                    {user.fullName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  sendFriendRequest(
                    user._id
                  )
                }
                className="bg-black text-white px-3 py-2 rounded-full text-sm"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}


      {/* FRIEND REQUESTS */}

      {friendRequests.length > 0 && (
        <div>
          <div className="px-4 py-2 text-sm font-semibold text-gray-500">
            Friend Requests
          </div>

          {friendRequests.map((user) => (
            <div
              key={user._id}
              className="p-4 border-b"
            >
              <div className="flex items-center justify-between">
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                    {user.fullName[0]}
                  </div>

                  <div>
                    <p className="font-medium">
                      {user.fullName}
                    </p>

                    <p className="text-sm text-gray-500">
                      Sent you a request
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  
                  <button
                    onClick={() =>
                      acceptFriendRequest(
                        user._id
                      )
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded-full text-sm"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      rejectFriendRequest(
                        user._id
                      )
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* FRIENDS */}

      <div className="px-4 py-2 text-sm font-semibold text-gray-500">
        Friends
      </div>

      {friends.map((user) => {
        const isOnline =
          onlineUsers.includes(user._id);

        const isSelected =
          selectedUser?._id === user._id;

        return (
          <div
            key={user._id}
            onClick={() =>
              setSelectedUser(user)
            }
            className={`p-4 cursor-pointer border-b transition-all duration-200 hover:bg-gray-100 ${
              isSelected
                ? "bg-gray-200"
                : ""
            }`}
          >
            <div className="flex items-center gap-3">

              {/* AVATAR */}

              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                  {user.fullName[0]}
                </div>

                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>


              {/* USER INFO */}

              <div>
                <p className="font-semibold">
                  {user.fullName}
                </p>

                <p className="text-sm text-gray-500">
                  {isOnline
                    ? "Online"
                    : "Offline"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}