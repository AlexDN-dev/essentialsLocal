import { AdminCard } from "../../Components/admin/AdminCard";
import { AdminNavbar } from "../../Components/admin/AdminNavbar";
import {
  faUser,
  faBagShopping,
  faWheatAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../../Styles/admin/admin.css";
import { CustomChart } from "../../Components/CustomChart";

export const HomeAdmin = () => {
  return (
    <>
      <AdminNavbar>
        <div className="HomeAdminContainer">
          <div className="stats">
            <AdminCard text={"Utilisateurs"} value={96} icon={faUser} />
            <AdminCard text={"Fermes"} value={9} icon={faWheatAlt} />
            <AdminCard text={"Commandes"} value={18} icon={faBagShopping} />
          </div>
          <div className="chartContainer">
            <h4>Top des ventes</h4>
            <CustomChart />
          </div>
        </div>
      </AdminNavbar>
    </>
  );
};
