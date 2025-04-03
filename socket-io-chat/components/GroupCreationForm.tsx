import React, { FormEvent, useEffect, useState } from "react";
import useUsers from "../hooks/useUsers";
import useGroups from "../hooks/useGroups";

const GroupCreationForm = () => {
  const { getUsers, data } = useUsers();
  const [groupName, setGroupName] = useState("");
  const { saveGroup, groupData } = useGroups();
  const [alert, setAlert] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    []
  );

  useEffect(() => {}, [groupData]);
  useEffect(() => {
    getUsers();
  }, []);

  const handleCheckBoxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = e.target;

    setSelectedUsers((prev) =>
      checked
        ? [...prev, value]
        : prev.filter((item) => item !== value)
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const group = {
      name: groupName,
      users: selectedUsers,
    };
    saveGroup(group);
    setAlert("Group Saved");
  };
  return (
    <div>
      {alert && (
        <p className="w-full p-3 bg-amber-300">{alert}</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          className="px-3 py-2 w-full bg-[#e6dadf] focus:bg-white focus:outline outline-0 mb-3"
          type="text"
          placeholder="Group name"
          required
          onChange={(e) => setGroupName(e.target.value)}
        />
        {data &&
          data.map((user) => (
            <label
              key={user._id}
              htmlFor={user.name}
              className="flex items-center mb-2 space-x-3 cursor-pointer text-gray-800 dark:text-white"
            >
              <input
                className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                id={user.name}
                value={user._id}
                onChange={handleCheckBoxChange}
                type="checkbox"
              />
              <span className="text-lg font-medium">
                {user.name}
              </span>
            </label>
          ))}
        <button
          type="submit"
          className="w-full mt-2 p-3 text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Create Group
        </button>
      </form>
    </div>
  );
};

export default GroupCreationForm;
