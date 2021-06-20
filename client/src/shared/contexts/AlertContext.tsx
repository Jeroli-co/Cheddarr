import React, { createContext, useContext, useState } from "react";
import { Alert } from "../components/Alert";

interface IAlertLevel {
  duration: number;
  color: string;
  bgColor: string;
}

class AlertLevel {
  static readonly DANGER: IAlertLevel = {
    duration: 8000,
    color: "#800000",
    bgColor: "#ff9290",
  };
  static readonly WARNING: IAlertLevel = {
    duration: 4000,
    color: "#805500",
    bgColor: "#ffe8a3",
  };
  static readonly SUCCESS: IAlertLevel = {
    duration: 5000,
    color: "#006500",
    bgColor: "#bcffb7",
  };
  static readonly INFO: IAlertLevel = {
    duration: 5000,
    color: "#4667ae",
    bgColor: "#a8cbff",
  };
}

interface IAlertContext {
  readonly pushSuccess: (message: string) => void;
  readonly pushWarning: (message: string) => void;
  readonly pushInfo: (message: string) => void;
  readonly pushDanger: (message: string) => void;
  readonly removeNotification: () => void;
}

export interface IAlert {
  readonly message: string;
  readonly level: IAlertLevel;
}

const AlertContextDefaultImpl: IAlertContext = {
  pushDanger(_: string): void {},
  pushInfo(_: string): void {},
  pushSuccess(_: string): void {},
  pushWarning(_: string): void {},
  removeNotification(): void {},
};

export const AlertContext = createContext<IAlertContext>(
  AlertContextDefaultImpl
);

type AlertState = {
  notification: IAlert | null;
  timer: any;
};

export const AlertContextProvider = (props: any) => {
  const [state, setState] = useState<AlertState>({
    notification: null,
    timer: 0,
  });

  const pushNotification = (n: IAlert) => {
    if (state.timer) clearTimeout(state.timer);
    setState({
      notification: n,
      timer: setTimeout(removeNotification, n.level.duration),
    });
  };

  const pushSuccess = (message: string) => {
    const notification: IAlert = {
      message: message,
      level: AlertLevel.SUCCESS,
    };
    pushNotification(notification);
  };

  const pushWarning = (message: string) => {
    const notification: IAlert = {
      message: message,
      level: AlertLevel.WARNING,
    };
    pushNotification(notification);
  };

  const pushDanger = (message: string) => {
    const notification: IAlert = {
      message: message,
      level: AlertLevel.DANGER,
    };
    pushNotification(notification);
  };

  const pushInfo = (message: string) => {
    const notification: IAlert = {
      message: message,
      level: AlertLevel.INFO,
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
