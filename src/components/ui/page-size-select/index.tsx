const sizes = [20, 50, 100, 200, 500];

interface PageSizeSelectProps {
  value: number;
  setValue: (value: number) => void;
}

const PageSizeSelect = ({ value, setValue }: PageSizeSelectProps) => {
  return (
    <select className="mr-8 border" value={value} onChange={e => setValue(Number(e.target.value))}>
      {sizes.map(size => (
        <option value={size} className="">{size} records/page</option>
      ))}
    </select>
  )
}

export default PageSizeSelect