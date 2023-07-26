import { useRadarrConfigs } from "../shared/hooks/useRadarrConfigs";
import { useSonarrConfigs } from "../shared/hooks/useSonarrConfigs";

export const useProviders = () => {
  const { radarrConfigs } = useRadarrConfigs();
  const { sonarrConfigs } = useSonarrConfigs();

  return {
    radarrConfigs,
    sonarrConfigs,
  };
};
