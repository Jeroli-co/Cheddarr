import React, {createContext, useState} from "react"
import {Notification} from "../elements/Notification";

const NotificationContext = createContext();

const NotificationContextProvider = (props) => {

  const [state, setState] = useState({ notification: null, timer: null });

  const pushNotification = (n) => {
    if (state.timer) clearTimeout(state.timer);
    setState({notification: n, timer: setTimeout(removeNotification, n.level.duration)});
  };

  const removeNotification = () => {
    setState({ notification: null, timer: null });
  };

  return (
    <NotificationContext.Provider value={{
      pushNotification,
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
