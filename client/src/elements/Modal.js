import React, {useRef} from "react";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

const ModalStyle = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalCloseButtonStyle = styled.span`
  position: absolute;
  top: 0;
  right: 10px;
  color: #aaaaaa;
  font-size: 28px;
  font-weight: bold;

  &:hover, &:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
`;

const Modal = ({ children, onClose }) => {

  const modalBackgroundRef = useRef();

  const _onClick = (e) => {
    if (e.target === modalBackgroundRef.current) {
      onClose();
    }
  };

  return (
    <ModalStyle ref={modalBackgroundRef} onClick={(e) => _onClick(e)}>
      <ModalCloseButtonStyle onClick={() => onClose()}>
        <FontAwesomeIcon icon={faTimes}/>
      </ModalCloseButtonStyle>
      { children }
    </ModalStyle>
  )
};

export {
  Modal
}
