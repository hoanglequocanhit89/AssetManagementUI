import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isSameDay } from "date-fns";
import "./react-datepicker-overrides.scss"

type DateFilterProps = {
    id?: string;
    label?: string;
    selectedDate?: Date;
    onSelect: (date: Date) => void;
    width?: string;
    isHighlight?: boolean
};

const DateFilter: React.FC<DateFilterProps> = ({
    id,
    label,
    selectedDate,
    onSelect,
    isHighlight
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

    return (
        <div
            className="relative w-full"
            id={id}
            ref={ref}
        >
            <div className={`flex items-stretch border rounded-md shadow-sm bg-white overflow-hidden ${isHighlight ? 'border-red-500' : 'border-gray-500'}`}>
                {label ?
                    <span className="absolute -top-4 left-3 bg-white px-2 text-[1.2rem] text-gray-800 pointer-events-none z-10">
                        {label}
                    </span> : "\u00A0 "
                }
                <div className="flex-grow px-3 pt-2.5 pb-1.5 text-[1.6rem] text-gray-800 text-left whitespace-nowrap">
                    {selectedDate ? selectedDate.toLocaleDateString() : "\u00A0 "}
                </div>

                {selectedDate && (
                    <button
                        type="button"
                        onClick={() => onSelect(undefined as any)}
                        className="flex items-center justify-center px-4 py-2 hover:bg-gray-100 text-gray-400 hover:text-black focus:outline-none"
                        title="Clear date"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="flex items-center justify-center px-3 py-2 border-l border-gray-500 hover:bg-gray-100 text-gray-600 hover:text-black focus:outline-none"
                >
                    <i className="fa-solid fa-calendar" title="Calendar"></i>
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-1 z-10">
                    <DatePicker
                        isClearable
                        selected={selectedDate}
                        onChange={(date) => {
                            if (date) {
                                onSelect(date);
                                setIsOpen(false);
                            }
                        }}
                        inline
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dayClassName={(date) =>
                            selectedDate && isSameDay(date, selectedDate)
                                ? "bg-red-500 text-white rounded-full"
                                : ""
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default DateFilter;
