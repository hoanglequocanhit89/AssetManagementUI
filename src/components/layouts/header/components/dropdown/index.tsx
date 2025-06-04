import { useEffect, useRef, useState } from "react";

interface DropDownProps {
  username?: string,
  onChangePassword?: () => void;
  onLogout?: () => void;
}

const DropDown = ({username, onChangePassword, onLogout}: DropDownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left d-lg-none">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 rounded text-white font-bold flex items-center space-x-4"
      >
        <span className="text-[2rem]">{username}</span>
        <i className="fa-solid fa-caret-down"></i>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-fit bg-white border rounded shadow-lg z-10 py-4">
          <button
            onClick={() => {
              setOpen(false);
              onChangePassword && onChangePassword();
            }}
            className="block w-max text-left px-4 py-2 hover:bg-gray-100 px-4"
          >
            Change Password
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onLogout && onLogout(); 
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 px-4"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default DropDown