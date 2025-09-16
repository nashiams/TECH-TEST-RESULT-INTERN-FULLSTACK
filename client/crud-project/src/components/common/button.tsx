interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  style?: React.CSSProperties;
}

function Button({
  type = "button",
  onClick,
  disabled = false,
  children,
  variant = "primary",
  style = {},
}: ButtonProps) {
  const getVariantStyle = (): React.CSSProperties => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
        };
      case "secondary":
        return {
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
        };
      case "danger":
        return {
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
        };
      default:
        return {
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
        };
    }
  };

  const defaultStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    ...getVariantStyle(),
    ...style,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={defaultStyle}
    >
      {children}
    </button>
  );
}

export default Button;
