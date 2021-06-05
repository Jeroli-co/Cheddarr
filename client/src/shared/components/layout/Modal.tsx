import React, { useRef } from "react";
import styled from "styled-components";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";
import { Icon } from "../Icon";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { STATIC_STYLES } from "../../enums/StaticStyles";

export const Container = styled.div<{ isOpen?: boolean }>`
  display: flex;
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  justify-content: center;
  align-items: center;

  /* Modal Content */
  .modal-content {
    padding: 0;
    border: 1px solid ${(props) => props.theme.primaryLight};
    min-width: 30%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    background: ${(props) => props.theme.primary};
    border-radius: 12px;

    @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
      width: 100%;
    }
  }

  /* The Close Button */
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .close:hover,
  .close:focus {
    color: ${(props) => props.theme.primaryLight};
    text-decoration: none;
    cursor: pointer;
  }

  header {
    border-bottom: 1px solid ${(props) => props.theme.primaryLight};
    padding: 16px 26px;
  }

  section {
    padding: 16px 26px;
  }

  footer {
    padding: 16px;
    color: white;
    border-top: 1px solid ${(props) => props.theme.primaryLight};

    @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
      padding: 0;
    }
  }
`;

type ModalProps = {
  close: () => void;
  children: any;
};

export const Modal = (props: ModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter([contentRef], () => props.close());

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <div className="modal-content" ref={contentRef}>
        <Icon className="close" icon={faTimes} onClick={() => props.close()} />
        {props.children}
      </div>
    </Container>
  );
};
