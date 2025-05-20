import React from 'react';

interface InputFieldProps {
    id?: string;
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ placeholder = '', value, onChange, id, disabled, ...rest }) => {
    return (
        <input
            type="text"
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full border border-gray-500 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-gray-300' : ''}`}
            {...rest}
        />
    );
};

export default InputField;