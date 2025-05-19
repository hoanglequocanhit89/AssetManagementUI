import React, { useState } from "react";

type SearchInputProps = {
    placeholder?: string;
    onSearch: (value: string) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({
    placeholder = "",
    onSearch,
}) => {
    const [value, setValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch(value.trim());
        }
    };

    return (
        <div className="flex items-stretch border border-gray-500 rounded-md shadow-sm bg-white overflow-hidden w-full">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-grow px-3 py-2 text-[1.6rem] text-gray-800 focus:outline-none"
            />
            <button
                onClick={() => onSearch(value.trim())}
                className="flex items-center justify-center px-3 py-2 border-l border-gray-500 hover:bg-gray-100 text-gray-600 hover:text-black focus:outline-none"
            >
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
    );
};

export default SearchInput;
