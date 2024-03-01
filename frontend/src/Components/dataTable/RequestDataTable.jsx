import React, { useState } from "react";
import "../../Styles/dataTable.css";
import "react-toastify/dist/ReactToastify.css";
import { PaginationSearchBar } from "../global/PaginationSearchBar";
import "react-toastify/dist/ReactToastify.css";
import { allowFarms } from "../../API/supportAPI";

export const RequestDataTable = ({ data }) => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRequestData, setSelectedRequestData] = useState(null);
  const [comment, setComment] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredData = data.filter((request) =>
    `${request.name} ${request.address} ${request.owner}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleFormSubmit = async (accept) => {
    if (!selectedRequestData || !comment) {
      console.error(
        "Veuillez sélectionner une demande et ajouter un commentaire."
      );
      return;
    }
    allowFarms(selectedRequestData, comment, accept);
    window.location.reload();
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
    setSelectedRequestData(currentItems[rowIndex]);
  };

  const handleBlackScreenClick = () => {
    setSelectedRow(null);
    setSelectedRequestData(null);
  };

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
            <th>Nom de la ferme</th>
            <th>Adresse</th>
            <th>Demandeur</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="3">Aucune donnée trouvée.</td>
            </tr>
          ) : (
            currentItems.map((request, rowIndex) => (
              <tr
                key={rowIndex}
                className={selectedRow === rowIndex ? "selectedRow" : ""}
                onClick={() => handleRowClick(rowIndex)}
              >
                <td>{request.name}</td>
                <td>{request.address}</td>
                <td>{request.owner}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedRow !== null && (
        <div className="blackScreen" onClick={handleBlackScreenClick}>
          {selectedRequestData && (
            <div className="requestData" onClick={(e) => e.stopPropagation()}>
              <div className="requestDataContainer">
                <h3>Informations</h3>
                <span>Nom</span>
                <p>{selectedRequestData.name}</p>
                <span>Adresse</span>
                <p>{selectedRequestData.address}</p>
                <span>Demandeur</span>
                <p>{selectedRequestData.owner}</p>
                <span>Description</span>
                <p>{selectedRequestData.desc}</p>
                <div className="requestAnswer">
                  <form>
                    <textarea
                      required
                      placeholder="Merci de rentrer un commentaire."
                      value={comment}
                      onChange={handleCommentChange}
                    ></textarea>
                    <div>
                      <button
                        type="button"
                        onClick={() => handleFormSubmit(true)}
                      >
                        Accepter
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormSubmit(false)}
                      >
                        Refuser
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
