import { useEffect, useState } from "react";
import { useProvidersService } from "./useProvidersService";
import { MEDIA_TYPES } from "../../media/enums/MediaTypes";
import { useProvidersUtils } from "./useProvidersUtils";

const useProviders = (media_type) => {
  const [providers, setProviders] = useState(null);
  const { getProviders } = useProvidersService();
  const { getProvidersByMediasType } = useProvidersUtils();
  useEffect(() => {
    getProviders().then((data) => {
      if (data) {
        if (media_type !== null) {
          setProviders(getProvidersByMediasType(data, media_type));
        } else {
          setProviders(data);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return providers;
};

export { useProviders };
