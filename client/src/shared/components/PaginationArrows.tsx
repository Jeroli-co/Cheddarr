import { PrimaryButton } from "./Button";
import { Icon } from "./Icon";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import styled from "styled-components";

const Container = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: ${(props) => props.theme.primaryLight};
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;

  p {
    padding: 20px;
  }
`;

type PaginationArrowsProps = {
  currentPage?: number;
  totalPages?: number;
  onLoadNext: () => void;
  onLoadPrev: () => void;
};

export const PaginationArrows = (props: PaginationArrowsProps) => {
  if (props.totalPages === undefined || props.totalPages <= 0) {
    return <div />;
  }

  return (
    <Container>
      <PrimaryButton type="button" onClick={() => props.onLoadPrev()}>
        <Icon icon={faArrowLeft} />
      </PrimaryButton>
      <p>
        {props.currentPage} ... {props.totalPages}
      </p>
      <PrimaryButton type="button" onClick={() => props.onLoadNext()}>
        <Icon icon={faArrowRight} />
      </PrimaryButton>
    </Container>
  );
};
