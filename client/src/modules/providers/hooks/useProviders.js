import { useEffect, useState } from "react";
import { useProvidersService } from "./useProvidersService";

const useProviders = () => {
  const [providers, setProviders] = useState(null);
  const { getProviders } = useProvidersService();
  useEffect(() => {
    getProviders().then((res) => {
      if (res) setProviders(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return providers;
};

export { useProviders };
