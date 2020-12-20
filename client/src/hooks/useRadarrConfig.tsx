import { useEffect, useState } from "react";
import { IRadarrConfig } from "../models/IRadarrConfig";
import { RadarrService } from "../services/RadarrService";
import {
  AsyncCallDefault,
  IAsyncCall,
  successAsyncCall,
} from "../models/IAsyncCall";

export const useRadarrConfig = () => {
  const [radarrConfig, setRadarrConfig] = useState<IAsyncCall<IRadarrConfig>>(
    AsyncCallDefault
  );

  useEffect(() => {
    RadarrService.GetRadarrConfig().then((res) => {
      if (res.error === null && res.data.length > 0)
        setRadarrConfig(successAsyncCall(res.data[0]));
    });
  }, []);

  return radarrConfig;
};
