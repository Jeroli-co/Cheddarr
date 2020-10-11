import { MEDIA_TYPES } from "../../media/enums/MediaTypes";
import { PROVIDERS_TYPES } from "../enums/ProvidersTypes";

const useProvidersUtils = () => {
  const getFilteredProviders = (providers, provider_type) => {
    return providers.filter(
      (provider) => provider.provider_type === provider_type
    );
  };

  const getProvidersByMediasType = (providers, media_type) => {
    switch (media_type) {
      case MEDIA_TYPES.MOVIES:
        return getFilteredProviders(providers, PROVIDERS_TYPES.MOVIES);
      case MEDIA_TYPES.SERIES:
        return getFilteredProviders(providers, PROVIDERS_TYPES.SERIES);
      default:
        return null;
    }
  };

  return {
    getFilteredProviders,
    getProvidersByMediasType,
  };
};

export { useProvidersUtils };
