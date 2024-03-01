import { useParams } from "react-router-dom";
import { Footer } from "../Components/global/Footer";
import Navbar from "../Components/global/Navbar";
import { orderDetails } from "../API/usersAPI";
import { useEffect, useState } from "react";
import "../Styles/views/shoppingCard.css";

export const OrderDetails = () => {
  const [productList, setProductList] = useState([]);
  const [order, setOrder] = useState([]);
  const [delivery, setDelivery] = useState([]);
  const { orderId } = useParams();
  const getOrderDetails = async () => {
    const data = await orderDetails(orderId);
    setProductList(data.productList);
    setOrder(data.order);
    setDelivery(data.orderData);
  };
  useEffect(() => {
    getOrderDetails();
  }, []);

  const setStatus = () => {
    switch (delivery.status) {
      case 1:
        return (
          <div>
            <h3>Étape 1 : Préparation</h3>
            <p className="orderTextStatus">
              Votre commande a été envoyé à été envoyer au(x) ferme(s)
              concernées. Ils préparent activement votre commande.
            </p>
          </div>
        );
      case 2:
        return (
          <div>
            <h3>Étape 2 : Prête</h3>
            <p className="orderTextStatus">
              Votre commande est prête a être récupéré ou un livreur va venir la
              récupérer à votre place (en fonction du moyen de récupération
              choisi).
            </p>
          </div>
        );
      case 3:
        return (
          <div>
            <h3>Étape 3 : Terminé</h3>
            <p className="orderTextStatus">
              Votre commande a été récupéré / livré avec succès !
            </p>
          </div>
        );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="shoppingCardContainer">
        <div className="halfWidth">
          <h2>Votre commande</h2>
          <div className="productShoppingContainer">
            {productList.map((p, index) => (
              <div className="shoppingProductList" key={index}>
                <img
                  src={"http://localhost:3000/products/" + p.picture + ".png"}
                  alt="image du produit"
                />
                <p>
                  {p.name} | {order[index].weight}
                </p>
                <p>{order[index].quantity} unités</p>
              </div>
            ))}
          </div>
        </div>
        <div className="halfWidth">
          <h2>Informations</h2>
          <div className="orderDetails">
            <h3 className="totalPrice">Prix total : {delivery.totalPrice} €</h3>
            {delivery.delivery !== null ? (
              <div style={{ margin: "10px 0" }}>
                <h4>Moyen de récupération</h4>
                <p>Livraison</p>
              </div>
            ) : (
              <div style={{ margin: "10px 0" }}>
                <h4>Moyen de récupération</h4>
                <p>Retrait </p>
              </div>
            )}
            <h3 style={{ margin: "10px 0" }}>État de votre commande</h3>
            {setStatus()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
