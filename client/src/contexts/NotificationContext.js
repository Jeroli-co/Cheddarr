import React, {createContext, useState} from "react"
import {Notification} from "../elements/Notification";

const NOTIFICATION_LEVEL = {
  DANGER: { duration: 8000, color: "#800000", bgColor: "#ff9290" },
  WARNING: { duration: 4000, color: "#805500", bgColor: "#ffe8a3" },
  SUCCESS: { duration: 5000, color: "#006500", bgColor: "#bcffb7" },
  INFO: { duration: 5000, color: "#4667ae", bgColor: "#a8cbff" },
};

class NotificationModel {
  constructor (message, level) {
    this.message = message;
    this.level = level;
  }
}

const NotificationContext = createContext();

const NotificationContextProvider = (props) => {

  const [state, setState] = useState({ notification: null, timer: null });

  const pushNotification = (n) => {
    if (state.timer) clearTimeout(state.timer);
    setState({notification: n, timer: setTimeout(removeNotification, n.level.duration)});
  };

  const pushSuccess = (message) => {
    const notification = new NotificationModel(message, NOTIFICATION_LEVEL.SUCCESS);
    pushNotification(notification);
  };

  const pushWarning = (message) => {
    const notification = new NotificationModel(message, NOTIFICATION_LEVEL.WARNING);
    pushNotification(notification);
  };

  const pushDanger = (message) => {
    const notification = new NotificationModel(message, NOTIFICATION_LEVEL.DANGER);
    pushNotification(notification);
  };

  const pushInfo = (message) => {
    const notification = new NotificationModel(message, NOTIFICATION_LEVEL.INFO);
    pushNotification(notification);
  };

  const removeNotification = () => {
    setState({ notification: null, timer: null });
  };

  return (
    <NotificationContext.Provider value={{
      pushSuccess,
      pushWarning,
      pushInfo,
      pushDanger,
      removeNotification
    }}>
      { props.children }
      <Notification notification={state.notification}/>
    </NotificationContext.Provider>
  )
};

export {
  NotificationContext,
  NotificationContextProvider
}
