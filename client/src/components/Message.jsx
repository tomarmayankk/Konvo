import useAuthStore from "../store/useAuthStore";

export default function Message({
  message,
}) {
  const { authUser } =
    useAuthStore();

  const isSender =
    message.senderId === authUser._id;

  return (
    <div
      className={`flex ${
        isSender
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[300px] px-4 py-2 rounded-2xl ${
          isSender
            ? "bg-black text-white"
            : "bg-gray-200"
        }`}
      >
        <p>{message.text}</p>

        <p
          className={`text-[10px] mt-1 ${
            isSender
              ? "text-gray-300"
              : "text-gray-500"
          }`}
        >
          {new Date(
            message.createdAt
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}