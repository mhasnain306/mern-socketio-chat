import { useEffect, useState } from "react";
import useGroups, { GroupType } from "../hooks/useGroups";
import useUsers, { UserData } from "../hooks/useUsers";

interface Props {
  userId: string;
  onSelectUser: (user: UserData) => void;
  onSelectGroup: (group: GroupType) => void;
}
const ActiveChatList = ({
  userId,
  onSelectUser,
  onSelectGroup,
}: Props) => {
  const { getOneUser } = useUsers();
  const { getUserGroups } = useGroups();
  const [userData, setUserData] = useState<UserData>();
  const [userGroups, setUserGroups] = useState<
    GroupType[] | null
  >(null);
  const [interactedUserData, setinteractedUserData] =
    useState<UserData>();

  useEffect(() => {
    if (interactedUserData) onSelectUser(interactedUserData);
  }, [interactedUserData]);
  useEffect(() => {
    const run = async () => {
      setUserData(await getOneUser(userId));
      setUserGroups(await getUserGroups(userId));
    };

    run();
  }, []);

  const onUserClickHandler = (id: string) => {
    const run = async () => {
      const user = await getOneUser(id);
      setinteractedUserData(user);
    };
    run();
  };
  return (
    <div>
      <ul>
        <li className="text-lg font-bold mb-3">People</li>
        {userData?.interactedWith?.map((user) => (
          <li
            onClick={() => onUserClickHandler(user._id)}
            key={user._id}
            className="cursor-pointer bg-gray-50 mb-1 text-xl p-1"
          >
            {user.name}
          </li>
        ))}
        <li className="text-lg font-bold mb-3 mt-5">Groups</li>
        {userGroups?.map((group) => (
          <li
            key={group._id}
            onClick={() => onSelectGroup(group)}
            className="cursor-pointer bg-gray-50 mb-1 text-xl p-1"
          >
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveChatList;
