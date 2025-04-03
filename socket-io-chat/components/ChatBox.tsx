import { FormEvent, useEffect, useRef, useState } from "react";
import useMessages from "../hooks/useMessages";
import useUsers, { UserData } from "../hooks/useUsers";
import socket from "../src/socket";
import { MessageType } from "./Chat";

interface Props {
  user: UserData;
  onBackButtonClick: () => void;
  loggedInUser: UserData;
  messages: MessageType[];
  onMessageSent: (message: MessageType) => void;
  onMessageDelivered: (message: MessageType) => void;
}

const ChatBox = ({
  user,
  onBackButtonClick,
  loggedInUser,
  messages,
  onMessageSent,
  onMessageDelivered,
}: Props) => {
  const { saveMessage, messageData } = useMessages();
  const { saveUserInteraction } = useUsers();
  const [message, setMessage] = useState("");
  const [isUserOnline, setUserOnline] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  useEffect(() => {
    socket.on("userConnected", (u) => {
      if (u.userId === user._id) {
        setUserOnline(true);
      }
    });
    socket.on("userDisconnected", (u) => {
      console.log(u);
      if (u.userId === user._id) {
        setUserOnline(false);
      }
    });
    socket.emit("isUserOnline", user._id);
    socket.on("isUserOnline", (u) => {
      if (u) {
        setUserOnline(true);
      } else setUserOnline(false);
    });
  }, []);
  useEffect(() => {
    if (!Array.isArray(messageData) && messageData) {
      if (loggedInUser) {
        const newMessage: MessageType = {
          _id: messageData._id,
          from: loggedInUser._id,
          to: user._id,
          message: message,
          sentAt: Date.now(),
          delivered: "server",
        };
        socket.emit(
          "chat",
          newMessage,
          (message: MessageType) => {
            if (!message) {
              console.log("The message couldn't deliver");
              return;
            }
            console.log(
              "This message has been delivered",
              message
            );
            onMessageDelivered(message);
          }
        );
        onMessageSent(newMessage);
        setMessage("");
      }
    }
  }, [messageData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (loggedInUser) {
      const newMessage: MessageType = {
        from: loggedInUser._id,
        to: user._id,
        message: message,
        sentAt: Date.now(),
        delivered: "server",
      };
      saveMessage(newMessage);

      const newUser = {
        _id: loggedInUser._id,
        name: loggedInUser.name,
        email: loggedInUser.email,
        interactedUserName: user.name,
        interactedUserId: user._id,
      };
      saveUserInteraction(newUser);
      const secondUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        interactedUserName: loggedInUser.name,
        interactedUserId: loggedInUser._id,
      };
      saveUserInteraction(secondUser);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto shadow-lg rounded-lg p-4 bg-white">
      <div className="flex items-center mb-4">
        <button
          className="cursor-pointer text-blue-500 hover:underline"
          onClick={() => onBackButtonClick()}
        >
          Back
        </button>
        <div>
          <h1 className="text-2xl ml-4 font-semibold">
            {user.name}
          </h1>
          <p
            className={
              isUserOnline ? "ml-4 text-green-800" : "ml-4"
            }
          >
            {isUserOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div
        ref={chatBoxRef}
        className="w-full p-4 h-96 bg-gray-100 rounded-lg mb-4 overflow-auto"
      >
        <ul className="flex flex-col space-y-2">
          {messages.map((message, index) => {
            if (
              (message.to === loggedInUser._id &&
                message.from === user._id) ||
              (message.from === loggedInUser._id &&
                message.to === user._id)
            ) {
              return (
                <li
                  className={`w-2/3 p-3 mb-2 rounded-lg ${
                    message.from === loggedInUser._id
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-black"
                  }`}
                  key={index}
                >
                  <p className="break-words">{message.message}</p>
                  <div className="flex justify-between">
                    <p
                      className={`text-sm mt-1 ${
                        message.from === loggedInUser._id
                          ? "text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      {new Date(
                        message.sentAt
                      ).toLocaleTimeString()}
                    </p>
                    {message.from === loggedInUser._id &&
                    message.delivered === "server" ? (
                      <p className="">&#10003;</p>
                    ) : message.from === loggedInUser._id &&
                      message.delivered === "recipient" ? (
                      <p>&#10003;&#10003;</p>
                    ) : null}
                  </div>
                </li>
              );
            } else return null;
          })}
        </ul>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            className="flex-grow p-2 bg-gray-200 rounded-l-lg border-0 outline-none"
            placeholder="Type your message here..."
            type="text"
            required
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
