import React, { useState, useEffect } from "react";
import "../../Styles/dataTable.css";
import "react-toastify/dist/ReactToastify.css";
import { PaginationSearchBar } from "../global/PaginationSearchBar";
import { CustomButton } from "../CustomButton";
import { switchStatus } from "../../API/farmsAPI";
import { showToast, clearToastStorage } from "../../utils/ToastUtils";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const FarmDataTable = ({ data }) => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedFarmData, setSelectedFarmData] = useState(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredData = data.filter((farm) =>
    `${farm.name} ${farm.address} ${farm.owner}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
    setSelectedFarmData(currentItems[rowIndex]);
  };

  const handleBlackScreenClick = () => {
    setSelectedRow(null);
    setSelectedFarmData(null);
  };
  const toggleSwitchFarmStatut = () => {
    switchStatus(
      selectedFarmData.id,
      selectedFarmData.isAvailable === 1 ? 0 : 1
    );
    showToast(
      `La ferme est maintenant ${
        selectedFarmData.isAvailable === 1 ? "caché !" : "visible !"
      }`,
      toast.POSITION.TOP_RIGHT
    );
    window.location.reload();
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
            <th>Adresse</th>
            <th>Gérant</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="3">Aucune donnée trouvée.</td>
            </tr>
          ) : (
            currentItems.map((farm, rowIndex) => (
              <tr
                key={rowIndex}
                className={selectedRow === rowIndex ? "selectedRow" : ""}
                onClick={() => handleRowClick(rowIndex)}
              >
                <td>{farm.name}</td>
                <td>{farm.address}</td>
                <td>{farm.owner}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedRow !== null && (
        <div className="blackScreen" onClick={handleBlackScreenClick}>
          {selectedFarmData && (
            <div className="farmDataAdmin" onClick={(e) => e.stopPropagation()}>
              <h2>Détails de la ferme</h2>
              <div className="userDataContainer">
                <div className="farmInfo">
                  <span>Nom</span>
                  <p>{selectedFarmData.name}</p>
                </div>
                <div className="farmInfo">
                  <span>Adresse</span>
                  <p>{selectedFarmData.address}</p>
                </div>
                <div className="farmInfo">
                  <span>Gérant</span>
                  <p>{selectedFarmData.owner}</p>
                </div>
                <div className="farmInfo">
                  <span>Statut</span>
                  <p>
                    {selectedFarmData.isAvailable === 1 ? "Visible" : "Caché"}
                  </p>
                </div>
                <CustomButton
                  text={
                    selectedFarmData.isAvailable === 1
                      ? "Masquer la ferme"
                      : "Afficher la ferme"
                  }
                  onClick={toggleSwitchFarmStatut}
                ></CustomButton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
