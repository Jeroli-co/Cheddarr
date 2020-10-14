import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { RequestReceivedContext } from "../../../contexts/RequestReceivedContext";

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
  onPrevRequest,
  onNextRequest,
  currentRequest,
}) => {
  const { request } = useContext(RequestReceivedContext);

  const handleClickPrev = (e) => {
    onPrevRequest();
    e.preventDefault();
  };
  const handleClickNext = (e) => {
    onNextRequest();
    e.preventDefault();
  };

  return (
    <RequestsPaginationContainer>
      <div className="pagination-buttons prev-button" onClick={handleClickPrev}>
        <FontAwesomeIcon icon={faCaretLeft} size="2x" />
      </div>
      Request {currentRequest.index + 1} / {request.children.length}
      <div className="pagination-buttons next-button" onClick={handleClickNext}>
        <FontAwesomeIcon icon={faCaretRight} size="2x" />
      </div>
    </RequestsPaginationContainer>
  );
};

export { RequestsPagination };
