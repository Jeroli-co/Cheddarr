import React, {useContext} from "react";
import {NotificationContext} from "../contexts/NotificationContext";

const Notification = ({ notification }) => {

  const { removeNotification } = useContext(NotificationContext);

  if (!notification)
    return <div/>;

  const columnsStyle = {
    position: "fixed",
    bottom: "10px",
    right: "10px",
    left: "10px",
    zIndex: 150
  };

  const style = {
    color: notification.level.color,
    backgroundColor: notification.level.bgColor
  };

  return (
    <div className="columns" style={columnsStyle}>
      <div className="column is-one-third-desktop is-offset-one-third-desktop is-two-thirds-tablet is-offset-one-third-tablet">
        <div className="notification" style={style}>
          <button className="delete" onClick={removeNotification}/>
          { notification.message }
        </div>
      </div>
    </div>
  );

};

export {
  Notification
}
