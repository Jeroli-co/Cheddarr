import { useApi } from "../../api/hooks/useApi";

const useProvidersService = () => {
  const baseUrl = "/providers/";
  const { executeRequest, methods } = useApi();

  const getProviders = async () => {
    const res = await executeRequest(methods.GET, baseUrl);
    switch (res.status) {
      case 200:
        return res;
      default:
        return null;
    }
  };

  return {
    getProviders,
  };
};

export { useProvidersService };
