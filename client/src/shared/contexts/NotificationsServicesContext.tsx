import React, { createContext, useContext, useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { INotificationsConfig } from "../models/INotificationsConfig";
import { IEmailConfig } from "../models/IEmailConfig";
import { useAPI } from "../hooks/useAPI";
import { useAlert } from "./AlertContext";
import { APIRoutes } from "../enums/APIRoutes";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";

interface INotificationsServicesContext {
  emailConfig: IAsyncCall<INotificationsConfig | null>;
  updateEmailConfig: (config: IEmailConfig) => Promise<IAsyncCall>;
  deleteEmailConfig: () => void;
}

const NotificationsServicesContextDefaultImpl: INotificationsServicesContext = {
  emailConfig: DefaultAsyncCall,
  updateEmailConfig(config: IEmailConfig): Promise<IAsyncCall> {
    return Promise.resolve(DefaultAsyncCall);
  },
  deleteEmailConfig(): void {},
};

const NotificationsServicesContext = createContext<
  INotificationsServicesContext
>(NotificationsServicesContextDefaultImpl);

export const useNotificationsServicesContext = () =>
  useContext(NotificationsServicesContext);

export const NotificationsServicesContextProvider = (props: any) => {
  const { get, put, remove } = useAPI();
  const { pushSuccess, pushDanger } = useAlert();

  const [emailConfig, setEmailConfig] = useState<
    IAsyncCall<INotificationsConfig | null>
  >(DefaultAsyncCall);

  useEffect(() => {
    get<INotificationsConfig>(APIRoutes.GET_EMAIL_SETTINGS).then((res) => {
      if (res) {
        setEmailConfig(res);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateEmailConfig = (data: IEmailConfig) => {
    const settings: INotificationsConfig = {
      enabled: data.enabled,
      settings: { ...data },
    };
    return put<INotificationsConfig>(
      APIRoutes.PUT_EMAIL_SETTINGS,
      settings
    ).then((res) => {
      if (res.status === 200) {
        pushSuccess("SMTP Server config saved");
        setEmailConfig({ ...emailConfig, data: res.data });
      } else {
        pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
      }
      return res;
    });
  };

  const deleteEmailConfig = () => {
    remove(APIRoutes.DELETE_EMAIL_SETTINGS).then((res) => {
      if (res.status === 200) {
        pushSuccess("SMTP Server config deleted");
        setEmailConfig({ ...DefaultAsyncCall, isLoading: false });
      } else {
        pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
      }
    });
  };

  return (
    <NotificationsServicesContext.Provider
      value={{ emailConfig, updateEmailConfig, deleteEmailConfig }}
    >
      {props.children}
    </NotificationsServicesContext.Provider>
  );
};
