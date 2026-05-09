import useChatStore from "../store/useChatStore";

export default function Notifications() {
  const {
    friendRequests,

    isNotificationOpen,

    acceptFriendRequest,

    rejectFriendRequest,
  } = useChatStore();

  if (!isNotificationOpen) return null;

  return (
    <div className="absolute left-[80px] top-5 w-[340px] bg-white border rounded-2xl shadow-xl z-50 overflow-hidden">


      {/* HEADER */}

      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">
          Notifications
        </h1>

        <p className="text-sm text-gray-500">
          Friend requests
        </p>
      </div>


      {/* EMPTY STATE */}

      {friendRequests.length ===
        0 && (
        <div className="p-6 text-center text-gray-500">
          No notifications
        </div>
      )}


      {/* REQUESTS */}

      <div className="max-h-[400px] overflow-y-auto">
        {friendRequests.map((user) => (
          <div
            key={user._id}
            className="p-4 border-b"
          >
            <div className="flex items-center justify-between">

              
              {/* USER */}

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  {user.fullName[0]}
                </div>

                <div>
                  <p className="font-semibold">
                    {user.fullName}
                  </p>

                  <p className="text-sm text-gray-500">
                    Sent you a request
                  </p>
                </div>
              </div>


              {/* ACTIONS */}

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    acceptFriendRequest(
                      user._id
                    )
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded-full text-sm hover:opacity-90"
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    rejectFriendRequest(
                      user._id
                    )
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:opacity-90"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}