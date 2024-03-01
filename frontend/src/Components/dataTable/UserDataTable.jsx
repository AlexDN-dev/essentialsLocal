import React, { useState, useEffect } from "react";
import "../../Styles/dataTable.css";
import { CustomButton } from "../CustomButton";
import { useClerk } from "@clerk/clerk-react";
import { switchUserStatus } from "../../API/usersAPI";
import { showToast, clearToastStorage } from "../../utils/ToastUtils";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { PaginationSearchBar } from "../global/PaginationSearchBar";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  return formattedDate;
};

export const UserDataTable = ({ data, adminIdList, updateUserData }) => {
  const { user } = useClerk();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredData = data.filter((row) =>
    `${row.firstName} ${row.lastName} ${row.emailAddresses[0].emailAddress}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const isAdmin = (userId) => {
    return adminIdList.includes(userId);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleRowClick = (rowIndex) => {
    setSelectedRow(rowIndex);
    setSelectedUserData(currentItems[rowIndex]);
  };

  const handleBlackScreenClick = () => {
    setSelectedRow(null);
    setSelectedUserData(null);
  };

  const switchUserStatut = () => {
    handleBlackScreenClick();
    const target = selectedUserData.id;
    const actualStatus = selectedUserData.banned;
    if (adminIdList.includes(user.id)) {
      switchUserStatus(target, actualStatus);
      updateUserData();
      showToast(
        `L'utilisateur a bien été ${
          actualStatus === true ? "débanni !" : "banni !"
        }`,
        toast.POSITION.TOP_RIGHT
      );
      window.location.reload();
    } else {
      console.error(
        "Erreur : L'utilisateur actuel n'est pas un administrateur."
      );
    }
  };

  useEffect(() => {
    const storedMessage = localStorage.getItem("toastMessage");
    const storedPosition = localStorage.getItem("toastPosition");

    if (storedMessage && storedPosition) {
      showToast(storedMessage, storedPosition);
      clearToastStorage();
    }
  }, []);

  return (
    <div className="dataContainer">
      <PaginationSearchBar
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <table className="data-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Mail</th>
            <th>Rôle</th>
            <th>Dernière connexion</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="5">Aucune donnée trouvée.</td>
            </tr>
          ) : (
            currentItems.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={selectedRow === rowIndex ? "selectedRow" : ""}
                onClick={() => handleRowClick(rowIndex)}
              >
                <td>
                  <div className="nameContainer">
                    <img src={row.imageUrl} alt="" />
                    {`${row.firstName ? row.firstName : ""} ${
                      row.lastName ? row.lastName : ""
                    }`}
                  </div>
                </td>
                <td>{row.emailAddresses[0].emailAddress}</td>
                <td>{isAdmin(row.id) ? "Admin" : "Utilisateur"}</td>
                <td>{formatDate(row.lastSignInAt)}</td>
                <td>{row.banned ? "Banni" : "Actif"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedRow !== null && (
        <div className="blackScreen" onClick={handleBlackScreenClick}>
          {selectedUserData && (
            <div className="userData" onClick={(e) => e.stopPropagation()}>
              <h2>Détails de l'utilisateur</h2>
              <img src={selectedUserData.imageUrl} alt="" />
              <div className="userDataContainer">
                <div className="userName">
                  <div>
                    <span>Nom</span>
                    <p>{selectedUserData.lastName}</p>
                  </div>
                  <div>
                    <span>Prénom</span>
                    <p>{selectedUserData.firstName}</p>
                  </div>
                </div>
                <div className="userInfo">
                  <span>ID</span>
                  <p>{selectedUserData.id}</p>
                </div>
                <div className="userInfo">
                  <span>Mail</span>
                  <p>{selectedUserData.emailAddresses[0].emailAddress}</p>
                </div>
                <div className="userInfo">
                  <span>Rôle</span>
                  <p>
                    {isAdmin(selectedUserData.id) ? "Admin" : "Utilisateur"}
                  </p>
                </div>
                <div className="userInfo">
                  <span>Dernière connexion</span>
                  <p>{formatDate(selectedUserData.lastSignInAt)}</p>
                </div>
                <div className="userInfo">
                  <span>Statut</span>
                  <p>{selectedUserData.banned ? "Banni" : "Actif"}</p>
                </div>
                {isAdmin(selectedUserData.id) ? (
                  ""
                ) : (
                  <CustomButton
                    text={
                      selectedUserData.banned === false
                        ? "Bannir l'utilisateur"
                        : "Débannir l'utilisateur"
                    }
                    onClick={switchUserStatut}
                  ></CustomButton>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
