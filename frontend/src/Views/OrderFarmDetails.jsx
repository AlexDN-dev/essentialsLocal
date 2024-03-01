import { useParams } from "react-router-dom";
import { Footer } from "../Components/global/Footer";
import Navbar from "../Components/global/Navbar";
import { orderDetails } from "../API/usersAPI";
import { useEffect, useState } from "react";
import "../Styles/views/shoppingCard.css";
import { confirmFarmOrder, getOrderDetailsForFarm } from "../API/farmsAPI";
import { CustomButton } from "../Components/CustomButton";

export const OrderFarmDetails = () => {
  const [productList, setProductList] = useState([]);
  const [order, setOrder] = useState([]);
  const [orderProduct, setOrderProduct] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [delivery, setDelivery] = useState([]);
  const [helper, setHelper] = useState([]);
  const { orderId, farmId } = useParams();
  const getOrderDetails = async () => {
    const data = await orderDetails(orderId);
    const orderProducts = await getOrderDetailsForFarm(orderId, farmId);
    setHelper(orderProducts);
    const filteredProductList = data.productList.filter((product) =>
      orderProducts.includes(product.id)
    );
    let validation = true;
    for (const productId of orderProducts) {
      const orderItem = data.order.find((item) => item.productid === productId);
      if (orderItem) {
        if (orderItem.status !== 1) {
          validation = false;
          break;
        }
      } else {
        continue;
      }
    }
    setIsValid(validation);
    setOrderProduct(filteredProductList);
    setProductList(data.productList);
    setOrder(data.order);
    setDelivery(data.orderData);
  };
  useEffect(() => {
    getOrderDetails();
  }, []);

  const [dialogVisible, setDialogVisible] = useState(false);

  const handleCustomButtonClick = () => {
    setDialogVisible(true);
  };
  const handleConfirm = async () => {
    setDialogVisible(false);
    setIsValid(true);
    await confirmFarmOrder(orderId, helper);
  };

  const handleCancel = () => {
    setDialogVisible(false);
  };

  const setStatus = () => {
    switch (delivery.status) {
      case 1:
        return <p style={{ margin: "0 0 10px 0" }}>En préparation</p>;
      case 2:
        return <p>Prête</p>;
      case 3:
        return <p>Terminé</p>;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="shoppingCardContainer">
        <div className="halfWidth">
          <h2>Votre commande</h2>
          <div className="productShoppingContainer">
            {orderProduct.map((p, index) => (
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
            <h3>État globale de la commande</h3>
            {setStatus()}
            {!isValid && (
              <CustomButton
                onClick={handleCustomButtonClick}
                text={"Valider la commande"}
              ></CustomButton>
            )}
          </div>
        </div>
      </div>
      <Footer />
      {dialogVisible && (
        <div className="dialog">
          <h3>Confirmation</h3>
          <p>
            En validant la commande, vous assurez que cette dernière est prête à
            être livré ou réceptionner par l'acheteur (en fonction du moyen de
            récupération).
          </p>
          <div className="buttonContainer">
            <CustomButton text={"Valider"} onClick={handleConfirm}>
              Valider
            </CustomButton>
            <CustomButton text={"Annuler"} onClick={handleCancel}>
              Annuler
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};
