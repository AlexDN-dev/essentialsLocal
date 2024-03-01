import { Footer } from "../Components/global/Footer";
import Navbar from "../Components/global/Navbar";
import "../Styles/views/payementPage.css";
import { cancelPayement } from "../API/farmsAPI";
import React, { useEffect } from "react";

export const CancelPayement = () => {
  useEffect(() => {
    const stripeId = sessionStorage.getItem("payementId");

    const cancelPaymentAsync = async () => {
      try {
        sessionStorage.removeItem("payementId");
        await cancelPayement(stripeId);
      } catch (error) {
        console.error("Erreur lors de l'annulation du paiement : ", error);
      }
    };

    cancelPaymentAsync();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="payementContainer">
        <img src="/pictures/cancel_payment.svg" alt="erreur" />
        <h2>Erreur lors de l'annulation du paiement</h2>
        <p>Une erreur est survenue lors de l'annulation du paiement.</p>
      </div>
      <Footer />
    </div>
  );
};
