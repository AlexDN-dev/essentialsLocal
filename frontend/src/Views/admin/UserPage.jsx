import React, { useState, useEffect } from "react";
import "../../Styles/admin/admin.css";
import { AdminNavbar } from "../../Components/admin/AdminNavbar";
import { UserDataTable } from "../../Components/dataTable/UserDataTable";
import { getAllUsers } from "../../API/usersAPI";
import { ToastContainer } from "react-toastify";

const splitAdminList = (data) => {
  const adminIdList = [];
  data.forEach((e) => adminIdList.push(e.publicUserData.userId));
  return adminIdList;
};

export const UserPage = () => {
  const [usersList, setUsersList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [dataTableKey, setDataTableKey] = useState(0); // Ajoutez cette ligne

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getAllUsers();
        setUsersList(usersData.users);
        setAdminList(usersData.admin);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs :",
          error
        );
      }
    };
    fetchData();
  }, []);

  const updateUserData = async () => {
    try {
      const usersData = await getAllUsers();
      setUsersList(usersData.users);
      setAdminList(usersData.admin);
      setDataTableKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  return (
    <>
      <AdminNavbar>
        <ToastContainer />
        <div className="HomeAdminContainer">
          <h2>Liste des utilisateurs</h2>
          <UserDataTable
            key={dataTableKey} // Ajoutez cette ligne pour mettre à jour la clé
            data={usersList}
            adminIdList={splitAdminList(adminList)}
            updateUserData={updateUserData}
          />
        </div>
      </AdminNavbar>
    </>
  );
};
