import "../Styles/customArea.css";

export const CustomArea = ({ placeholder, onChange }) => {
  return (
    <textarea
      required
      className="customArea"
      placeholder={placeholder}
      onChange={onChange}
    ></textarea>
  );
};
