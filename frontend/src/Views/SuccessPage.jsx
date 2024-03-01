import { Footer } from "../Components/global/Footer";
import Navbar from "../Components/global/Navbar";
import "../Styles/views/payementPage.css";
import { successPayement } from "../API/farmsAPI";
import React, { useEffect } from "react";

export const SuccessPayement = () => {
  useEffect(() => {
    const stripeId = sessionStorage.getItem("payementId");
    const cartString = localStorage.getItem("cart");
    const cart = JSON.parse(cartString);

    const successPaymentAsync = async () => {
      try {
        const body = {
          stripeId: stripeId,
          cart: cart,
        };
        sessionStorage.removeItem("payementId");
        //localStorage.removeItem("cart");
        await successPayement(body);
      } catch (error) {
        console.error("Erreur lors de l'annulation du paiement : ", error);
      }
    };

    successPaymentAsync();
  }, []);
  return (
    <div>
      <Navbar />
      <div className="payementContainer">
        <img src="/pictures/success_payment.png" alt="payement réussi" />
        <h2>Payement réussi !</h2>
        <p>Vous recevrez un mail contenant un résumé de votre commande.</p>
      </div>
      <Footer />
    </div>
  );
};
