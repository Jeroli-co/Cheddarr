import { useEffect, useState } from "react";
import { useAPI } from "./useAPI";
import { useAlert } from "../contexts/AlertContext";
import { IConfig } from "../models/IConfig";
import { APIRoutes } from "../enums/APIRoutes";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";

export const useConfig = () => {
  const [config, setConfig] = useState<IAsyncCall<IConfig | null>>(
    DefaultAsyncCall
  );
  const { get, patch } = useAPI();
  const { pushDanger } = useAlert();

  useEffect(() => {
    get<IConfig>(APIRoutes.CONFIG).then((res) => {
      if (res.status === 200) {
        setConfig(res);
      } else {
        pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateConfig = (payload: Partial<IConfig>) => {
    return patch<IConfig>(APIRoutes.CONFIG, payload).then((res) => {
      if (res.status === 200) {
        setConfig(res);
      } else {
        pushDanger("Cannot update config");
      }
      return res;
    });
  };

  return {
    config,
    updateConfig,
  };
};
