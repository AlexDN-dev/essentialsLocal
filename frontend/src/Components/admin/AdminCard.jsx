import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const AdminCard = ({ text, value, icon }) => {
  return (
    <div className="adminCard">
      <div>
        <FontAwesomeIcon
          className="adminCardIcon"
          icon={icon}
          size="xl"
          color="white"
        />
        <h3>{text}</h3>
      </div>
      <h2>{value}</h2>
    </div>
  );
};
