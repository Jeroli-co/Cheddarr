import * as React from "react";
import { useContext } from "react";
import {
  INotification,
  NotificationContext,
} from "../../contexts/notifications/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

type NotificationStyleProps = {
  backgroundColor: string;
};

const NotificationStyle = styled.div<NotificationStyleProps>`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 150;
  color: ${(props) => props.color};
  background-color: ${(props) => props.backgroundColor};
  padding: 10px;
  margin-bottom: 5px;
  min-width: 30vw;
  min-height: 5%;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type NotificationProps = {
  notification: INotification | null;
};

const Notification = ({ notification }: NotificationProps) => {
  const { removeNotification } = useContext(NotificationContext);

  if (notification === null) return <div />;

  return (
    <NotificationStyle
      color={notification.level.color}
      backgroundColor={notification.level.bgColor}
    >
      {notification.message}
      <div className="is-pointed" onClick={removeNotification}>
        <FontAwesomeIcon icon={faTimes} />
      </div>
    </NotificationStyle>
  );
};

export { Notification };
