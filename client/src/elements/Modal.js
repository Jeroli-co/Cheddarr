import React, {useRef} from "react";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

const ModalStyle = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  z-index: 100;
`;

const ModalCloseButton = styled.span`
  position: absolute;
  top: 0;
  right: 10px;
  color: #aaaaaa;
  font-size: 28px;
  font-weight: bold;
  z-index: 101;

  &:hover, &:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
`;

const ModalCard = styled.div`
  position: relative;
  margin: 0;
  max-width: 80vw;
  max-height: 80vh;
  z-index: 101;
  overflow-y: auto;
  -ms-overflow-style: none; /* IE 11 */
  scrollbar-width: none; /* Firefox 64 */
  ::-webkit-scrollbar {
    display: none;
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
      <ModalCloseButton onClick={() => onClose()}>
        <FontAwesomeIcon icon={faTimes}/>
      </ModalCloseButton>
      <ModalCard>
        { children }
      </ModalCard>
    </ModalStyle>
  )
};

export {
  Modal
}
