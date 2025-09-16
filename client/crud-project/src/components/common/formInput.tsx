interface FormInputProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  style?: React.CSSProperties;
}

function FormInput({
  type,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  style = {},
}: FormInputProps) {
  const defaultStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    ...style,
  };

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      style={defaultStyle}
    />
  );
}

export default FormInput;
