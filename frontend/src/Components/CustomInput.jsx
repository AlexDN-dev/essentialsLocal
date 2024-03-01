import "../Styles/customInput.css";

export const CustomInput = ({ placeholder, onChange }) => {
  return (
    <input
      required
      className="customInput"
      type="text"
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};
