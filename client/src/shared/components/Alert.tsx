import React from "react";
import { useContext } from "react";
import { IAlert, AlertContext } from "../contexts/AlertContext";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { STATIC_STYLES } from "../enums/StaticStyles";
import { Icon } from "./Icon";

type NotificationStyleProps = {
  backgroundColor: string;
};

const Container = styled.div<NotificationStyleProps>`
  position: fixed;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 150;
  color: ${(props) => props.color};
  background-color: ${(props) => props.backgroundColor};
  padding: 10px 20px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    margin-right: 20px;
  }

  width: 30%;
  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    width: 50%;
  }
  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    width: 95%;
  }
`;

type AlertProps = {
  notification: IAlert | null;
};

const Alert = ({ notification }: AlertProps) => {
  const { removeNotification } = useContext(AlertContext);

  if (notification === null) return <div />;

  return (
    <Container
      color={notification.level.color}
      backgroundColor={notification.level.bgColor}
    >
      <p>{notification.message}</p>
      <div onClick={removeNotification}>
        <Icon icon={faTimes} />
      </div>
    </Container>
  );
};

export { Alert };
