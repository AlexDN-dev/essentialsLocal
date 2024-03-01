import React, { useState, useEffect } from "react";
import "../Styles/orderHistory.css";
import { CustomButton } from "./CustomButton";
import { getOrders } from "../API/usersAPI";
import { useNavigate } from "react-router-dom";

export const OrderHistory = ({ mail }) => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const order = await getOrders(mail);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mettre à jour la date et le statut pour chaque commande
      const updatedOrders = order.map((o) => ({
        ...o,
        createdAt: new Date(o.createdAt).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        statusText: getStatusText(o.status),
      }));

      setOrderHistory(updatedOrders);
      setIsLoading(false);
    };
    fetchOrderHistory();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "En préparation";
      case 2:
        return "Prête";
      case 3:
        return "Terminé";
      default:
        return "";
    }
  };

  const swapPage = (orderId) => {
    navigate("/profile/order/" + orderId);
  };

  return (
    <div className="orderHistory">
      {isLoading ? (
        <div className="loaderContainer">
          <img src="/gif/loader.gif" alt="chargement de l'historique" />
          <p>Chargement de l'historique...</p>
        </div>
      ) : (
        <div className="history">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>MONTANT</th>
                <th>STATUT</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.createdAt}</td>
                  <td>{order.totalPrice} €</td>
                  <td>{order.statusText}</td>
                  <td>
                    <CustomButton
                      onClick={() => swapPage(order.id)}
                      text={"Voir"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
