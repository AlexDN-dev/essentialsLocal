import Navbar from "../Components/global/Navbar";
import { Footer } from "../Components/global/Footer";
import { useClerk, UserProfile } from "@clerk/clerk-react";
import "../Styles/views/profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faWarehouse,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";
import { OrderHistory } from "../Components/orderHistory";
import { hasFarm } from "../API/farmsAPI";
import { useEffect, useState } from "react";

export const Profile = () => {
  const { user, openUserProfile } = useClerk();
  const [farm, setFarm] = useState({});
  const [loading, setLoading] = useState(true);
  const [userLoaded, setUserLoaded] = useState(false);

  const handleSettings = () => {
    openUserProfile();
  };

  const checkHasFarm = async () => {
    const farmData = await hasFarm(user.emailAddresses[0].emailAddress);
    setFarm(farmData.data[0]);
  };
  const admin = async () => {
    const status = await isAdmin(user.id);
    setLoading(!status);
  };

  useEffect(() => {
    if (user) {
      setUserLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (userLoaded) {
      admin();
    }
  }, [userLoaded]);

  useEffect(() => {
    checkHasFarm();
  }, []);

  return (
    <div>
      <Navbar />
      <UserProfile path="/user-profile" routing="path" />
      <div className="profileContainer">
        <div className="profile">
          <div className="heroProfile">
            {farm ? (
              <a href={`/farmParams/${farm.id}`}>
                {" "}
                <FontAwesomeIcon
                  icon={faWarehouse}
                  size="xl"
                  color="#000"
                  className="farmParams"
                />
              </a>
            ) : (
              <></>
            )}
            <FontAwesomeIcon
              icon={faGear}
              size="xl"
              color="#000"
              className="profileParams"
              onClick={handleSettings}
            />
            <div className="mainInformations">
              <img src={user.imageUrl} alt="Photo de profil" />
              <p>{user.emailAddresses[0].emailAddress}</p>
            </div>
            <div className="profileInformationContainer">
              <div>
                <span>Nom</span>
                <p> {user.firstName || "Inconnu"}</p>
              </div>
              <div>
                <span>Prénom</span>
                <p> {user.lastName || "Inconnu"}</p>
              </div>
              <div>
                <span>Pseudo</span>
                <p> {user.username || "Inconnu"}</p>
              </div>
              <div>
                <span>Téléphone</span>
                <p> {user.primaryPhoneNumber || "Inconnu"}</p>
              </div>
              <div>
                <span>Créer le</span>
                <p>
                  {" "}
                  {user.createdAt.getDate() +
                    "/" +
                    user.createdAt.getMonth() +
                    "/" +
                    user.createdAt.getFullYear() +
                    " à " +
                    user.createdAt.getHours() +
                    ":" +
                    user.createdAt.getMinutes() || "Inconnu"}
                </p>
              </div>
            </div>
          </div>
          <div className="orderHistoryContainer">
            {loading ? (
              <a href={`/admin`}>
                {" "}
                <FontAwesomeIcon
                  icon={faToolbox}
                  size="xl"
                  color="#000"
                  className="adminProfileButton"
                />
              </a>
            ) : (
              <></>
            )}
            <h3>Historique des commandes</h3>
            <OrderHistory mail={user.emailAddresses[0].emailAddress} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
