import { useState } from "react";

interface DropDownProps {
  username?: string,
  onChangePassword?: () => void;
  onLogout?: () => void;
}

const DropDown = ({username, onChangePassword, onLogout}: DropDownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 rounded text-white font-bold flex items-center"
      >
        <span>{username}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
          <button
            onClick={() => {
              setOpen(false);
              // onChangePassword();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Change Password
          </button>
          <button
            onClick={() => {
              setOpen(false);
              // onLogout();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default DropDown