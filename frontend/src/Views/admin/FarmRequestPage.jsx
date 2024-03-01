import "../../Styles/admin/admin.css";
import React, { useState, useEffect } from "react";
import { AdminNavbar } from "../../Components/admin/AdminNavbar";
import { ToastContainer } from "react-toastify";
import { getAllRequestFarm } from "../../API/supportAPI";
import { RequestDataTable } from "../../Components/dataTable/RequestDataTable";

export const FarmRequestPage = () => {
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = await getAllRequestFarm();
        setRequestList(requestData);
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
          <RequestDataTable data={requestList} />
        </div>
      </AdminNavbar>
    </>
  );
};
