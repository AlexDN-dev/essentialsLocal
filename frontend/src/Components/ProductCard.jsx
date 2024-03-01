import { useNavigate } from "react-router-dom";
import "../Styles/productCard.css";

export const ProductCard = ({ name, id, backgroundImage }) => {
  const navigate = useNavigate();

  const navigateToProduct = () => {
    navigate(`/product/${id}`);
  };

  const cardStyle = {
    backgroundImage: `url(${backgroundImage})`,
  };

  return (
    <div className="productCard" style={cardStyle} onClick={navigateToProduct}>
      <p>{name}</p>
    </div>
  );
};
