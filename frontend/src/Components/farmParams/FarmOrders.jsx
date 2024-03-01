import { useState, useEffect } from "react";
import { getFarmOrder } from "../../API/farmsAPI";
import "../../Styles/views/order.css";
import { useNavigate } from "react-router-dom";

export const FarmOrders = ({ farmId }) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const getFarmOrders = async () => {
    const data = await getFarmOrder(farmId);
    setOrders(data);
  };
  useEffect(() => {
    getFarmOrders();
  }, []);

  const swapPage = (orderId) => {
    navigate("/farmParams/" + farmId + "/order/" + orderId);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "En préparation";
      case 1:
        return "Prête";
      default:
        return "Prête";
    }
  };
  return (
    <div className="orderPage">
      <div className="orderContainer">
        {orders.map((order) => (
          <div
            className="order"
            key={order.id}
            onClick={() => swapPage(order.orderid)}
          >
            <p>ID : {order.orderid}</p>
            <p>{getStatusText(order.status)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
