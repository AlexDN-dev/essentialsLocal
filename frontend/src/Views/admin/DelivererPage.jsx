import { useEffect, useState } from "react";
import "../../Styles/admin/admin.css";
import { AdminNavbar } from "../../Components/admin/AdminNavbar";
import { CustomButton } from "../../Components/CustomButton";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addDeliverer,
  gettingDeliverer,
  removeDeliverer,
} from "../../API/supportAPI";

export const DelivererPage = () => {
  const [deliverer, setDeliverer] = useState({
    firstName: "",
    lastName: "",
    mail: "",
  });
  const [delivererList, setDelivererList] = useState([]);

  const getDeliverer = async () => {
    console.log("Fetching deliverers...");
    const delivererlist = await gettingDeliverer();
    console.log("Deliverers fetched:", delivererlist);
    setDelivererList(delivererlist);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDeliverer({ ...deliverer, [name]: value });
  };
  const handleSubmit = async () => {
    if (
      deliverer.firstName === "" ||
      deliverer.lastName === "" ||
      deliverer.mail === ""
    ) {
      toast.error("Merci de remplir tout les champs.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } else {
      await addDeliverer(deliverer);
      setDeliverer({
        firstName: "",
        lastName: "",
        mail: "",
      });
      toast.success("Livreur ajouté !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      setTimeout(async () => {
        const delivererlist = await gettingDeliverer();
        setDelivererList(delivererlist);
      }, 1000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeDeliverer(id);
      toast.success("Livreur supprimé !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      setTimeout(async () => {
        const delivererlist = await gettingDeliverer();
        setDelivererList(delivererlist);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la suppression du livreur:", error);
    }
  };

  useEffect(() => {
    getDeliverer();
  }, []);

  return (
    <>
      <ToastContainer />
      <AdminNavbar>
        <div className="delivererPageContainer">
          <h2>Ajouter un livreur</h2>
          <div className="addDelivererContainer">
            <input
              type="text"
              name="firstName"
              placeholder="Nom"
              value={deliverer.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Prénom"
              value={deliverer.lastName}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="mail"
              placeholder="Adresse mail"
              value={deliverer.mail}
              onChange={handleInputChange}
              required
            />
            <CustomButton text={"Ajouter le livreur"} onClick={handleSubmit} />
          </div>
          <h2>Liste des livreurs</h2>
          <div className="delivererListContainer">
            {delivererList.map((deliverer) => (
              <div className="deliverer" key={deliverer.id}>
                <p>
                  {deliverer.lastname} {deliverer.firstname}
                </p>
                <p>{deliverer.mail}</p>
                <CustomButton
                  text={"Supprimer"}
                  onClick={() => handleDelete(deliverer.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </AdminNavbar>
    </>
  );
};
