import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUsers, { UserData } from "../hooks/useUsers";
import ChatBox from "./ChatBox";
import socket from "../src/socket";
export interface Message {
  from: string;
  to: string;
  message: string;
}
const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [selectedUser, setSelectedUser] =
    useState<UserData | null>(null);
  const { getUsers, data, error, isLoading } = useUsers();

  useEffect(() => {
    getUsers();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("chatAppToken");
    if (token) {
      const decoded = jwtDecode<UserData>(token);
      const id = decoded._id;
      socket.emit("register", id);
      setUserId(id);
      setName(decoded.name);
    }
    const handleChat = (message: Message) => {
      const newMessage = {
        from: message.from,
        to: message.to,
        message: message.message,
      };
      setMessages((prev) => [...prev, newMessage]);
      console.log("Hello chat received");
    };
    socket.on("chat", handleChat);
    return () => {
      socket.off("chat", handleChat);
    };
  }, []);
  const removeToken = () => {
    localStorage.removeItem("chatAppToken");
    navigate("/auth");
  };

  return (
    <>
      <div className="w-full flex justify-between p-5">
        <h1 className="text-3xl">Chat App</h1>
        <div className="">
          <h1 className="text-2xl">{`${name}`}</h1>
          <button
            className="cursor-pointer bg-amber-200"
            onClick={removeToken}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="mx-auto w-96 shadow-2xl rounded-lg p-4">
        <div className="mb-3">
          {!selectedUser ? (
            <ul>
              {data &&
                data.map((user) => {
                  if (user._id === userId) return;
                  return (
                    <li
                      className="cursor-pointer bg-gray-50 mb-1 text-xl p-1"
                      onClick={() => setSelectedUser(user)}
                      key={user._id}
                    >
                      {" "}
                      {user.name}
                    </li>
                  );
                })}
            </ul>
          ) : (
            <ChatBox
              myId={userId}
              user={selectedUser}
              onBackButtonClick={() => {
                setSelectedUser(null);
              }}
              messages={messages}
              onMessageSent={(newMessage) =>
                setMessages((prev) => [...prev, newMessage])
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
