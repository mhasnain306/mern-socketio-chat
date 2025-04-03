import React from "react";

interface Props {
  onLogout: () => void;
  name: string;
}
const Navbar = ({ onLogout, name }: Props) => {
  return (
    <>
      <h1 className="text-3xl">Chat App</h1>
      <div className="">
        <select
          name=""
          id=""
          className="text-2xl cursor-pointer"
          onChange={(e) => {
            if (e.target.value === "logout") onLogout();
          }}
        >
          <option value="">{`${name}`}</option>
          <option value="logout">Logout</option>
        </select>
      </div>
    </>
  );
};

export default Navbar;
