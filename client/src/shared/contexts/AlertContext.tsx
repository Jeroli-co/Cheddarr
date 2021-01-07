import React, { createContext, useContext, useState } from "react";
import { Alert } from "../components/Alert";

interface INotificationLevel {
  duration: number;
  color: string;
  bgColor: string;
}

class NotificationLevel {
  static readonly DANGER: INotificationLevel = {
    duration: 8000,
    color: "#800000",
    bgColor: "#ff9290",
  };
  static readonly WARNING: INotificationLevel = {
    duration: 4000,
    color: "#805500",
    bgColor: "#ffe8a3",
  };
  static readonly SUCCESS: INotificationLevel = {
    duration: 5000,
    color: "#006500",
    bgColor: "#bcffb7",
  };
  static readonly INFO: INotificationLevel = {
    duration: 5000,
    color: "#4667ae",
    bgColor: "#a8cbff",
  };
}

interface INotificationContext {
  readonly pushSuccess: (message: string) => void;
  readonly pushWarning: (message: string) => void;
  readonly pushInfo: (message: string) => void;
  readonly pushDanger: (message: string) => void;
  readonly removeNotification: () => void;
}

export interface INotification {
  readonly message: string;
  readonly level: INotificationLevel;
}

const NotificationContextDefaultImpl: INotificationContext = {
  pushDanger(_: string): void {},
  pushInfo(_: string): void {},
  pushSuccess(_: string): void {},
  pushWarning(_: string): void {},
  removeNotification(): void {},
};

export const AlertContext = createContext<INotificationContext>(
  NotificationContextDefaultImpl
);

type NotificationState = {
  notification: INotification | null;
  timer: number;
};

export const NotificationContextProvider = (props: any) => {
  const [state, setState] = useState<NotificationState>({
    notification: null,
    timer: 0,
  });

  const pushNotification = (n: INotification) => {
    if (state.timer) clearTimeout(state.timer);
    setState({
      notification: n,
      timer: setTimeout(removeNotification, n.level.duration),
    });
  };

  const pushSuccess = (message: string) => {
    const notification: INotification = {
      message: message,
      level: NotificationLevel.SUCCESS,
    };
    pushNotification(notification);
  };

  const pushWarning = (message: string) => {
    const notification: INotification = {
      message: message,
      level: NotificationLevel.WARNING,
    };
    pushNotification(notification);
  };

  const pushDanger = (message: string) => {
    const notification: INotification = {
      message: message,
      level: NotificationLevel.DANGER,
    };
    pushNotification(notification);
  };

  const pushInfo = (message: string) => {
    const notification: INotification = {
      message: message,
      level: NotificationLevel.INFO,
    };
    pushNotification(notification);
  };

  const removeNotification = () => {
    setState({ notification: null, timer: 0 });
  };

  return (
    <AlertContext.Provider
      value={{
        pushSuccess,
        pushWarning,
        pushInfo,
        pushDanger,
        removeNotification,
      }}
    >
      {props.children}
      <Alert notification={state.notification} />
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
