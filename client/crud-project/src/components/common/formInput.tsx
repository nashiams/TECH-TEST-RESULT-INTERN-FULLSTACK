interface FormInputProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  required?: boolean;
  style?: React.CSSProperties;
  rows?: number;
}

function FormInput({
  type,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  style = {},
  rows,
}: FormInputProps) {
  const defaultStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    ...style,
  };

  if (type === "textarea") {
    return (
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows || 4}
        style={defaultStyle}
      />
    );
  }

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
