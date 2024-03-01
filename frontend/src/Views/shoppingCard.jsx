import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Footer } from "../Components/global/Footer";
import Navbar from "../Components/global/Navbar";
import { useClerk } from "@clerk/clerk-react";
import "../Styles/views/shoppingCard.css";
import { faArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { CustomButton } from "../Components/CustomButton";
import {
  getFarmAddress,
  canDelivery,
  payement,
  checkQuantity,
} from "../API/farmsAPI";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ShoppingCard = () => {
  const { user } = useClerk();
  const [selectedMode, setSelectedMode] = useState("retrait");
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [farm, setFarm] = useState([]);
  const [address, setAddress] = useState({
    rue: "",
    number: "",
    postalCode: "",
    city: "",
  });

  const handleModeClick = () => {
    setSelectedMode((prevMode) =>
      prevMode === "retrait" ? "livraison" : "retrait"
    );
  };

  const getCart = async () => {
    const cartData = localStorage.getItem("cart");
    const parsedCart = cartData ? JSON.parse(cartData) : [];
    setCart(parsedCart);
    setFarm(await getFarmAddress(parsedCart));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  useEffect(() => {
    getCart();
  }, []);

  const handleRemoveProduct = (productId) => {
    const updatedCart = cart.filter((product) => product.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    getCart();
  };

  useEffect(() => {
    let calculatedTotalPrice = 0;
    cart.forEach((p) => {
      calculatedTotalPrice += p.price * p.quantity;
    });
    setTotalPrice(calculatedTotalPrice);
  }, [cart]);

  const makePayement = async () => {
    if (selectedMode === "livraison") {
      if (
        address.rue === "" ||
        address.number === "" ||
        address.city === "" ||
        address.postalCode === ""
      ) {
        toast.error("Merci de remplir tout les champs !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } else {
        const fullAddress =
          address.rue +
          " " +
          address.number +
          ", " +
          address.postalCode +
          " " +
          address.city;
        const response = await canDelivery(fullAddress, farm);
        if (response.canDelivery) {
          startPayement(cart, fullAddress);
        } else {
          toast.error(
            "L'une des fermes est trop loin (max 30km), impossible de livrer.",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3500,
            }
          );
        }
      }
    } else {
      startPayement(cart, null);
    }
  };

  const startPayement = async (cart, delivery) => {
    if (await checkQuantity(cart)) {
      const stripe = await loadStripe(
        "pk_test_51NGf5JGmSjjp9mudViylKKyTLJmd3NdIBcvM1p2a4WyC5pbzd80Di929lvDYPg9DtjOlj1vB9pfatEzth8KO4xwq00UyRiJmxo"
      );

      const body = {
        products: cart,
        price: totalPrice,
        deliveryMethod: selectedMode,
        user: user.emailAddresses[0].emailAddress,
        delivery: delivery,
      };

      try {
        const response = await payement(body);
        sessionStorage.setItem("payementId", response.id);
        const session = response.id;
        const result = await stripe.redirectToCheckout({
          sessionId: session,
        });

        if (result.error) {
          console.log(result.error);
        }
      } catch (error) {
        console.error("Erreur lors du paiement :", error);
      }
    } else {
      toast.error("L'un de nos produits n'est plus disponible.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3500,
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="shoppingCardContainer">
        <div>
          <h2>Votre panier</h2>
          <div className="productShoppingContainer">
            {cart.map((p) => (
              <div className="shoppingProductList" key={p.id + p.weight}>
                <img src={p.image} alt="image du produit" />
                <p>
                  {p.name} | {p.weight}
                </p>
                <p>{p.quantity} unités</p>
                <p>{p.price * p.quantity} €</p>
                <button onClick={() => handleRemoveProduct(p.id)}>
                  <FontAwesomeIcon
                    className=""
                    icon={faXmark}
                    size="lg"
                    color="#fffff"
                  />
                </button>
              </div>
            ))}
          </div>
          <p className="priceDisplay">
            Prix total : <span>{totalPrice} €</span>
          </p>
        </div>
        <div>
          <h2>Options de livraison</h2>
          <h3>Type de récupération</h3>
          <div className="selectedRecup">
            <p
              className={selectedMode === "retrait" ? "selected" : ""}
              onClick={handleModeClick}
            >
              Retrait
            </p>
            <div
              className={`arrow-icon ${
                selectedMode !== "livraison" ? "flipped" : ""
              }`}
              onClick={handleModeClick}
            >
              <FontAwesomeIcon
                icon={faArrowRight}
                className="search-icon"
                size="lg"
                color="#808080"
              />
            </div>
            <p
              className={selectedMode === "livraison" ? "selected" : ""}
              onClick={handleModeClick}
            >
              Livraison
            </p>
          </div>
          {selectedMode === "retrait" && (
            <div className="retraitDetails">
              <div>
                <p>
                  Voici les adresses où il vous faudra vous rendre pour
                  récupérer
                </p>
                <p> votre/vos colis quand ils seront prêt.</p>
              </div>
              {farm.map((farm) => (
                <div key={farm.id} className="farmAddressContainer">
                  <h3>{farm.name}</h3>
                  <p>{farm.address}</p>
                </div>
              ))}
            </div>
          )}
          {selectedMode === "livraison" && (
            <div className="livraisonDetails">
              <div>
                <input
                  type="text"
                  placeholder="Rue"
                  name="rue"
                  value={address.rue}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  placeholder="Numéro"
                  name="number"
                  value={address.number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Code postal"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Ville"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          <CustomButton text={"Payer"} onClick={makePayement}></CustomButton>
        </div>
      </div>
      <Footer />
    </div>
  );
};
