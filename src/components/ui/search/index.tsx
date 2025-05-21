import React, { useEffect, useState } from "react";

type SearchInputProps = {
    placeholder?: string;
    onSearch: (value: string) => void;
    value?: string;
};

const SearchInput: React.FC<SearchInputProps> = ({
    placeholder = "",
    onSearch,
    value: externalValue = "",
}) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(externalValue);
    }, [externalValue]);

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
                onChange={(e) => {
                    setValue(e.target.value);
                    onSearch(e.target.value.trim());
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-[1.6rem] text-gray-800 focus:outline-none"
                style={{ minWidth: 0 }}
            />
            {value && (
                <button
                    type="button"
                    onClick={() => {
                        setValue("");
                        onSearch("");
                    }}
                    className="flex items-center justify-center w-10 text-gray-400 hover:text-black focus:outline-none"
                    tabIndex={-1}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            )}
            <button
                onClick={() => onSearch(value.trim())}
                className="flex items-center justify-center w-12 min-w-[40px] border-l border-gray-500 hover:bg-gray-100 text-gray-600 hover:text-black focus:outline-none"
            >
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
    );
};

export default SearchInput;
