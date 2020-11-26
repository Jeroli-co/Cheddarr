import { useEffect, useState } from "react";
import { PlexService } from "../services/PlexService";

const initialPlexStatus = {
  enabled: false,
  loaded: false,
};

const usePlexStatus = () => {
  const [plexStatus, setPlexStatus] = useState(initialPlexStatus);
  useEffect(() => {
    PlexService.GetPlexStatus().then((res) => {
      let enabled = false;
      if (res.error === null) {
        enabled = res.data;
      }
      setPlexStatus({ enabled: enabled, loaded: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return plexStatus;
};

export { usePlexStatus };
