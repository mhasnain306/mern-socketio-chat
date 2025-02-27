import { FormEvent, useState } from "react";
import { UserData } from "../hooks/useUsers";
import socket from "../src/socket";
import { Message } from "./Chat";

interface Props {
  user: UserData;
  onBackButtonClick: () => void;
  myId: string;
  messages: Message[];
  onMessageSent: (message: Message) => void;
}
const ChatBox = ({
  user,
  onBackButtonClick,
  myId,
  messages,
  onMessageSent,
}: Props) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newMessage = {
      from: myId,
      to: user._id,
      message: message,
    };
    socket.emit("chat", newMessage);
    onMessageSent(newMessage);
    setMessage("");
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-3">
        <button
          className="cursor-pointer underline"
          onClick={() => onBackButtonClick()}
        >
          back
        </button>
        <h1 className="text-2xl ml-2">{user.name}</h1>
      </div>
      <div className="w-full p-3 h-96 bg-gray-50 rounded-lg mb-3 overflow-auto">
        <ul className="flex flex-col">
          {messages.map((message, index) => {
            if (
              (message.to === myId &&
                message.from === user._id) ||
              (message.from === myId && message.to === user._id)
            ) {
              console.log(message.from, user._id);
              console.log(message.from, myId);

              return (
                <li
                  className={
                    message.from === myId
                      ? "w-2/3 p-3 mb-2 bg-amber-200 rounded-lg self-end"
                      : "w-2/3 p-3 mb-2 bg-blue-200 rounded-lg"
                  }
                  key={index}
                >
                  {message.message}
                </li>
              );
            } else return;
          })}
        </ul>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            className="p-2 w-full bg-gray-100 rounded-lg border-0 outline-0"
            placeholder="type message here"
            type="text"
          />
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
