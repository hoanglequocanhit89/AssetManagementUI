import React, { useState, useRef, useEffect } from "react";

type Option = {
    value: string;
    label: string;
};

type SelectFilterProps = {
    label: string;
    options: Option[];
    selected?: string;
    onSelect: (value: string) => void;
};

const SelectFilter: React.FC<SelectFilterProps> = ({
    label,
    options,
    selected,
    onSelect,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find((opt) => opt.value === selected)?.label;

    return (
        <div className="relative w-full" ref={ref}>
            <div className="flex items-stretch border border-gray-500 rounded-md shadow-sm bg-white overflow-hidden">
                <div className="flex-grow pl-4 pr-2 mr-8 py-2 text-[1.6rem] text-gray-800 text-left flex items-center truncate overflow-hidden whitespace-nowrap">
                    {selectedLabel || label}
                </div>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="flex items-center justify-center px-3 border-l border-gray-500 hover:bg-gray-100 text-gray-600 hover:text-black focus:outline-none"
                >
                    <i className="fa-solid fa-filter" title="Filter"></i>
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-full bg-white border border-gray-500 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => {
                                onSelect(option.value);
                                setIsOpen(false);
                            }}
                            className={`px-4 py-2 text-[1.6rem] text-gray-800 hover:bg-gray-100 cursor-pointer ${selected === option.value ? "bg-gray-100 font-medium" : ""} text-left`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectFilter;
