import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";
import { SCREEN_SIZE } from "../../../../../utils/enums/ScreenSizes";
import { useOutsideAlerter } from "../../../../../utils/hooks/useOutsideAlerter";

const DeleteRequestButtonStyle = styled.button`
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  color: ${(props) => props.theme.danger};
  background: white;
  border: 1px solid ${(props) => props.theme.danger};
  box-shadow: none;
  border: none;
  border-radius: 6px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
  font-size: 1em;
  cursor: pointer;

  ${(props) =>
    props.isDeleteInitiated &&
    css`
      background: ${(props) => props.theme.danger};
      color: white;
      border: white;
    `}

  @media (max-width: ${SCREEN_SIZE.MOBILE_LARGE}px) {
    margin-top: 10px;
  }
`;

const DeleteRequestButton = ({ handleDeleteRequest }) => {
  const [isDeleteInitiated, setIsDeleteInitiated] = useState(false);
  const componentRef = useRef(null);
  useOutsideAlerter([componentRef], () => setIsDeleteInitiated(false));

  const onDeleteClick = (e) => {
    if (!isDeleteInitiated) {
      setIsDeleteInitiated(true);
    } else {
      handleDeleteRequest();
    }
    e.preventDefault();
  };

  return (
    <DeleteRequestButtonStyle
      type="button"
      ref={componentRef}
      onClick={onDeleteClick}
      isDeleteInitiated={isDeleteInitiated}
    >
      {isDeleteInitiated ? "Confirm delete" : "Delete request"}
    </DeleteRequestButtonStyle>
  );
};

export { DeleteRequestButton };
