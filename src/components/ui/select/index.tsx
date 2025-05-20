import React from 'react'

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
}

const Select = ({ value, onChange, options }: SelectProps) => {
  return (
    <select
      className="w-full border border-gray-400 rounded px-4 py-2 text-gray-700"
      value={value}
      onChange={onChange}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

export default Select