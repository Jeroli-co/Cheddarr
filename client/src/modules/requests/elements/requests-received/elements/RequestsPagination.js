import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const RequestsPaginationContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 10px;

  & .pagination-buttons {
    cursor: pointer;
  }
`;

const RequestsPagination = ({
  currentIndex,
  requestsCount,
  handlePrevRequest,
  handleNextRequest,
}) => {
  const onPrevRequest = (e) => {
    handlePrevRequest();
    e.preventDefault();
  };
  const onNextRequest = (e) => {
    handleNextRequest();
    e.preventDefault();
  };
  return (
    <RequestsPaginationContainer>
      <div className="pagination-buttons prev-button" onClick={onPrevRequest}>
        <FontAwesomeIcon icon={faCaretLeft} size="2x" />
      </div>
      Request {currentIndex + 1} / {requestsCount}
      <div className="pagination-buttons next-button" onClick={onNextRequest}>
        <FontAwesomeIcon icon={faCaretRight} size="2x" />
      </div>
    </RequestsPaginationContainer>
  );
};

export { RequestsPagination };
