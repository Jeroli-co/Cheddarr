import { useEffect, useState } from "react";
import {
  AsyncCallDefault,
  IAsyncCall,
  successAsyncCall,
} from "../models/IAsyncCall";
import { SonarrService } from "../services/SonarrService";
import { ISonarrConfig } from "../models/ISonarrConfig";

export const useSonarrConfig = () => {
  const [sonarrConfig, setSonarrConfig] = useState<IAsyncCall<ISonarrConfig>>(
    AsyncCallDefault
  );

  useEffect(() => {
    SonarrService.GetSonarrConfig().then((res) => {
      if (res.error === null && res.data.length > 0)
        setSonarrConfig(successAsyncCall(res.data[0]));
    });
  }, []);

  return sonarrConfig;
};
