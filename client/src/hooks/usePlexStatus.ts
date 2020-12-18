import { useEffect, useState } from "react";
import { PlexService } from "../services/PlexService";

const initialPlexStatus = {
  enabled: false,
  loaded: false,
};

const usePlexStatus = () => {
  const [plexStatus, setPlexStatus] = useState(initialPlexStatus);
  useEffect(() => {
    PlexService.GetPlexConfig().then((res) => {
      let enabled = false;
      if (res.error === null) {
        enabled = res.data.length > 0 && res.data[0].enabled;
      }
      setPlexStatus({ enabled: enabled, loaded: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return plexStatus;
};

export { usePlexStatus };
