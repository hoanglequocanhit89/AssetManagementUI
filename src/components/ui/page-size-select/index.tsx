const sizes = [20, 50, 100, 200, 500];

interface PageSizeSelectProps {
  value: number;
  setValue: (value: number) => void;
  onChange: () => void;
}

const PageSizeSelect = ({ value, setValue, onChange }: PageSizeSelectProps) => {
  return (
    <select className="mr-8 border" value={value} onChange={e => {
      setValue(Number(e.target.value));
      if (onChange) {
        onChange();
      }
    }}>
      {sizes.map((size, index) => (
        <option key={index} value={size} className="">{size} records/page</option>
      ))}
    </select>
  )
}

export default PageSizeSelect