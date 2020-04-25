import React, { useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ModalStyle = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
`;

const ModalCard = styled.div`
  position: relative;
  margin: 0;
  max-width: 80vw;
  min-height: 60vh;
  max-height: 100vh;
  z-index: 101;
  overflow-y: auto;
  -ms-overflow-style: none; /* IE 11 */
  scrollbar-width: none; /* Firefox 64 */
  ::-webkit-scrollbar {
    display: none;
  }
`;

const ModalCloseButton = styled.span`
  position: absolute;
  top: 0;
  right: 10px;
  color: ${(props) => props.theme.dark};
  font-size: 28px;
  font-weight: bold;
  z-index: 101;
  opacity: 0.6;

  &:hover,
  &:focus {
    text-decoration: none;
    cursor: pointer;
    opacity: 1;
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
      <ModalCard>
        <ModalCloseButton onClick={() => onClose()}>
          <FontAwesomeIcon icon={faTimes} />
        </ModalCloseButton>
        {children}
      </ModalCard>
    </ModalStyle>
  );
};

export { Modal };
