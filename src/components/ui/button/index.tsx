import React from 'react';

interface ButtonProps {
    text: string;
    onClick?: () => void;
    type: 'primary' | 'outline';
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, type, disabled }) => {
    const baseClass = "py-2.5 px-4 rounded-lg transition-colors duration-200 whitespace-nowrap";
    const primaryClass = "bg-[var(--primary-color)] text-white hover:bg-red-700";
    const outlineClass = "bg-white text-gray-700 border border-gray-400 hover:bg-gray-100";
    const disabledClass = "opacity-50 cursor-not-allowed pointer-events-none";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={
                baseClass +
                " " +
                (type === "primary" ? primaryClass : outlineClass) +
                (disabled ? " " + disabledClass : "")
            }
        >
            {text}
        </button>
    );
};

export default Button;