import { jwtDecode } from "jwt-decode";
import _, { unionBy } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroupType } from "../hooks/useGroups";
import useMessages from "../hooks/useMessages";
import useUsers, { UserData } from "../hooks/useUsers";
import socket from "../src/socket";
import ActiveChatList from "./ActiveChatList";
import ChatBox from "./ChatBox";
import GroupChatBox from "./GroupChatBox";
import GroupCreationForm from "./GroupCreationForm";
import Navbar from "./Navbar";
import UserList from "./UserList";

export interface MessageType {
  _id?: string;
  from: string;
  to: string;
  message: string;
  sentAt: number;
  delivered: "server" | "recipient";
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [receivedMessage] = useState<MessageType | null>(null);
  const [loggedInUser, setloggedInUser] = useState<UserData>(
    {} as UserData
  );
  const [activeTab, setActiveTab] = useState("Users");
  const [selectedUser, setSelectedUser] =
    useState<UserData | null>(null);
  const [selectedGroup, setSelectedGroup] =
    useState<GroupType | null>(null);
  const { getUsers, data } = useUsers();
  const { getMessages, updateMessage, messageData } =
    useMessages();

  useEffect(() => {
    if (messageData && Array.isArray(messageData)) {
      setMessages((prev) =>
        unionBy([...messageData, ...prev], "_id")
      );
    }
  }, [messageData]);

  useEffect(() => {
    // let updatedMessage: MessageType;
  }, [receivedMessage]);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const handleChat = (
      message: MessageType,
      callback: (message: MessageType) => void
    ) => {
      console.log("Received chat event:", message);

      const run = async () => {
        if (message && message._id) {
          const updatedMessage = await updateMessage(
            message._id,
            {
              ..._.omit(message, "_id"),
              delivered: "recipient",
            }
          );
          console.log("Updated Message", updatedMessage);
          setMessages((prev) => [...prev, updatedMessage]);
          callback(updatedMessage);
        }
      };
      run();
    };
    socket.on("chat", handleChat);
    socket.on(
      "MessagesSentLater",
      (deliveredMessages: MessageType[]) => {
        deliveredMessages.map((dMsg) => {
          setMessages((prev) =>
            prev.map((message) =>
              message._id === dMsg._id ? dMsg : message
            )
          );
        });
      }
    );

    const token = localStorage.getItem("chatAppToken");

    if (token) {
      const decoded = jwtDecode<UserData>(token);
      setloggedInUser(decoded);
      const id = decoded._id;
      socket.emit("register", id);
    }
    return () => {
      socket.off("chat", handleChat);
      socket.off("register");
    };
  }, []);

  const removeToken = () => {
    localStorage.removeItem("chatAppToken");
    socket.emit("userLoggedOut", loggedInUser._id);
    navigate("/auth");
  };

  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
    getMessages(user._id, loggedInUser._id);
  };

  const handleSelectGroup = (group: GroupType) => {
    setSelectedGroup(() => group);
  };

  return (
    <>
      <div className="w-full flex justify-between p-5">
        <Navbar
          name={loggedInUser.name}
          onLogout={() => removeToken()}
        />
      </div>

      <div className="w-full max-w-md mx-auto mt-10">
        {/* Tabs Header */}
        <div className="flex border-b">
          {["Users", "Create Group", "Chat"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedUser(null);
              }}
              className={`flex-1 py-2 text-center cursor-pointer text-sm font-medium transition ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="p-4">
          {activeTab === "Users" && (
            <div className="mb-3">
              {!selectedUser ? (
                <UserList
                  data={data}
                  userId={loggedInUser._id}
                  onUserSelection={(user) =>
                    handleSelectUser(user)
                  }
                />
              ) : (
                <ChatBox
                  loggedInUser={loggedInUser}
                  user={selectedUser}
                  onBackButtonClick={() => {
                    setSelectedUser(() => null);
                  }}
                  messages={messages}
                  onMessageSent={(newMessage) =>
                    setMessages((prev) => [...prev, newMessage])
                  }
                  onMessageDelivered={(deliveredMessage) => {
                    if (deliveredMessage) {
                      console.log(
                        "Delivered Message about to be state updated: ",
                        deliveredMessage,
                        deliveredMessage._id,
                        deliveredMessage.message
                      );
                    } else {
                      console.error(
                        "Delivered message is missing properties:",
                        deliveredMessage
                      );
                    }
                    setMessages((prev) =>
                      prev.map((message) => {
                        // console.log(
                        //   message._id,
                        //   deliveredMessage._id,
                        //   message._id === deliveredMessage._id
                        //     ? deliveredMessage
                        //     : message
                        // );
                        return message._id ===
                          deliveredMessage._id
                          ? deliveredMessage
                          : message;
                      })
                    );
                  }}
                />
              )}
            </div>
          )}

          {activeTab === "Create Group" && (
            <div className="mx-auto w-96 shadow-2xl rounded-lg p-4">
              <GroupCreationForm />
            </div>
          )}
          {activeTab === "Chat" && (
            <div>
              {!selectedUser && !selectedGroup ? (
                <ActiveChatList
                  onSelectUser={(user) => handleSelectUser(user)}
                  onSelectGroup={(group) =>
                    handleSelectGroup(group)
                  }
                  userId={loggedInUser._id}
                />
              ) : selectedUser ? (
                <ChatBox
                  loggedInUser={loggedInUser}
                  user={selectedUser}
                  onBackButtonClick={() => {
                    setSelectedUser(null);
                    setSelectedGroup(null);
                  }}
                  messages={messages}
                  onMessageSent={(newMessage) =>
                    setMessages((prev) => [...prev, newMessage])
                  }
                  onMessageDelivered={(deliveredMessage) =>
                    setMessages((prev) =>
                      prev.map((message) =>
                        message._id === deliveredMessage._id
                          ? deliveredMessage
                          : message
                      )
                    )
                  }
                />
              ) : (
                <GroupChatBox
                  group={selectedGroup}
                  onBackButtonClick={() => {
                    setSelectedUser(null);
                    setSelectedGroup(null);
                  }}
                  loggedInUser={loggedInUser}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
