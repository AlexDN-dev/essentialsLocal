import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "../Styles/views/farmSearch.css";

export const FarmCard = ({ data, onClick }) => {
  return (
    <div className="farmCardContainer" onClick={onClick}>
      <div className="locationDot">
        <FontAwesomeIcon
          icon={faLocationDot}
          color="#fff"
          size="lg"
        ></FontAwesomeIcon>
      </div>
      <div className="farmData">
        <h3>{data.name}</h3>
        <p>{data.address}</p>
        <p>{data.distance} Km</p>
      </div>
    </div>
  );
};
