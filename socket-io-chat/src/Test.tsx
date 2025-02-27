import { FormEvent, useEffect, useState } from "react";
import socket from "./socket";
import "./Test.css";

const Test = () => {
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [conMessage, setConMessage] = useState("");
  const [channelMessage, setChannelMessage] = useState<string[]>(
    []
  );

  useEffect(() => {
    socket.on("connect", () => {
      setConMessage(socket.id || "");
    });
    socket.on("chat message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const handleMessageSubmit = (e: FormEvent) => {
    e.preventDefault();
    socket.emit("chat message", message, channel);
    console.log(message, channel);

    setMessage("");
  };

  const handleChannelSubmit = (e: FormEvent) => {
    e.preventDefault();
    socket.emit("join-channel", channel, (message: string) => {
      setChannelMessage((prev) => [...prev, message]);
    });
  };
  return (
    <div className="app-container">
      <div className="messages-container">
        {conMessage && <p>{conMessage}</p>}
        {channelMessage &&
          channelMessage.map((cmsg, index) => (
            <p key={index}>{cmsg}</p>
          ))}
        <ul className="messages">
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleMessageSubmit}>
        <div className="form">
          <input
            value={message || ""}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Message"
          />
          <button type="submit">Send</button>
        </div>
      </form>
      <form onSubmit={handleChannelSubmit}>
        <div className="form">
          <input
            placeholder="Channel"
            onChange={(e) => setChannel(e.target.value)}
            type="text"
          />
          <button type="submit">Join</button>
        </div>
      </form>
    </div>
  );
};

export default Test;
