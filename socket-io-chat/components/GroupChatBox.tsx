import { FormEvent, useEffect, useRef, useState } from "react";
import useGroupChat from "../hooks/useGroupChat";
import { GroupType } from "../hooks/useGroups";
import { UserData } from "../hooks/useUsers";

interface Props {
  group: GroupType | null;
  onBackButtonClick: () => void;
  loggedInUser: UserData;
}

const GroupChatBox = ({
  group,
  onBackButtonClick,
  loggedInUser,
}: Props) => {
  const messageRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const { groupMessages } = useGroupChat(
    message,
    loggedInUser,
    group as GroupType
  );

  useEffect(() => {}, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage(messageRef.current?.value || "");
    if (messageRef.current) messageRef.current.value = "";
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
        <h1 className="text-2xl ml-4 font-semibold">
          {group?.name}
        </h1>
      </div>
      <div className="w-full p-4 h-96 bg-gray-100 rounded-lg mb-4 overflow-auto">
        <ul className="flex flex-col space-y-2">
          {groupMessages.map((message) => (
            <li key={message._id}>{message.content}</li>
          ))}
        </ul>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            ref={messageRef}
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

export default GroupChatBox;
