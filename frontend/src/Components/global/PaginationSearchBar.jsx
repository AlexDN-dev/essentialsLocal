import React from "react";

export const PaginationSearchBar = ({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  searchTerm,
  handleSearchChange,
}) => {
  return (
    <div className="pagination">
      <input
        type="text"
        className="search"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Rechercher..."
      />
      {currentPage !== 0 ? (
        <div>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            &lt;
          </button>
          <span>{`${currentPage}/${totalPages}`}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
