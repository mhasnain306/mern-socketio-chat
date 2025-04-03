import { UserData } from "../hooks/useUsers";

interface Props {
  data: UserData[] | null;
  userId: string;
  onUserSelection: (user: UserData) => void;
}
const UserList = ({ data, userId, onUserSelection }: Props) => {
  return (
    <ul>
      {data &&
        data.map((user) => {
          if (user._id === userId) return;
          return (
            <li
              className="cursor-pointer bg-gray-50 mb-1 text-xl p-1"
              onClick={() => onUserSelection(user)}
              key={user._id}
            >
              {" "}
              {user.name}
            </li>
          );
        })}
    </ul>
  );
};

export default UserList;
