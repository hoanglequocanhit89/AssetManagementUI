interface CustomRadioProps {
  checked: boolean;
  onChange: () => void;
  onClick?: (e: React.MouseEvent) => void;
}

function CustomRadio({ checked, onChange, onClick }: CustomRadioProps) {
  return (
    <div
      className="relative w-6 h-6 cursor-pointer"
      onClick={(e) => {
        onClick?.(e);
        onChange();
      }}
    >
      {/* Outer circle */}
      <div
        className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
          checked
            ? "bg-[#CF2338] border-[#CF2338]"
            : "bg-white border-gray-300 hover:border-gray-400"
        }`}
      >
        {/* Inner dot/checkmark when selected */}
        {checked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomRadio;