import "../../Styles/admin/admin.css";
import React, { useState, useEffect } from "react";
import { AdminNavbar } from "../../Components/admin/AdminNavbar";
import { FarmDataTable } from "../../Components/dataTable/FarmDataTable";
import { ToastContainer } from "react-toastify";
import { getAllFarms } from "../../API/farmsAPI";

export const FarmPage = () => {
  const [farmList, setFarmList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const farmsData = await getAllFarms();
        setFarmList(farmsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des fermes :", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <AdminNavbar>
        <ToastContainer />
        <div className="HomeAdminContainer">
          <h2>Liste des Fermes</h2>
          <FarmDataTable data={farmList} />
        </div>
      </AdminNavbar>
    </>
  );
};
