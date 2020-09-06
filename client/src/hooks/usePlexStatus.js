import { usePlex } from "./usePlex";
import { useEffect, useState } from "react";

const initialPlexStatus = {
  enabled: false,
  loaded: false,
};

const usePlexStatus = () => {
  const { getPlexStatus } = usePlex();
  const [plexStatus, setPlexStatus] = useState(initialPlexStatus);

  useEffect(() => {
    getPlexStatus().then((enabled) =>
      setPlexStatus({ enabled: enabled, loaded: true })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return plexStatus;
};

export { usePlexStatus };
