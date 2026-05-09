import { useEffect } from "react";

import useAuthStore from "../store/useAuthStore";

import useChatStore from "../store/useChatStore";

export default function ProfilePage() {
  const { authUser } =
    useAuthStore();

  const {
    friends,
    getFriends,
  } = useChatStore();

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-50">


      {/* HEADER */}

      <div className="p-8 border-b bg-white">
        <div className="flex items-center gap-6">

          
          {/* AVATAR */}

          <div className="w-28 h-28 rounded-full bg-black text-white flex items-center justify-center text-5xl font-bold">
            {authUser?.fullName[0]}
          </div>


          {/* USER INFO */}

          <div>
            <h1 className="text-4xl font-bold">
              {authUser?.fullName}
            </h1>

            <p className="text-gray-500 mt-2">
              {authUser?.email}
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Member of Konvo
            </p>
          </div>
        </div>
      </div>


      {/* FRIENDS SECTION */}

      <div className="p-8">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold">
            Friends
          </h2>

          <p className="text-gray-500">
            {friends.length} Friends
          </p>
        </div>


        {/* FRIEND GRID */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {friends.map((friend) => (
            <div
              key={friend._id}
              className="bg-white p-5 rounded-2xl border hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">

                
                {/* AVATAR */}

                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
                  {friend.fullName[0]}
                </div>


                {/* INFO */}

                <div>
                  <h3 className="font-semibold text-lg">
                    {friend.fullName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {friend.email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* EMPTY STATE */}

        {friends.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No friends yet
          </div>
        )}
      </div>
    </div>
  );
}
