import { useContext, useEffect, useState } from "react";
import { useApi } from "../../../api/hooks/useApi";
import { AuthContext } from "../../../auth/contexts/AuthContext";

const useApiKey = () => {
  const [apiKey, setApiKey] = useState("");
  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);
  const apiKeyUri = "/user/key/";

  useEffect(() => {
    getApiKey().then((res) => {
      if (res) {
        const key = res.data["key"];
        if (key) {
          setApiKey(key);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getApiKey = async () => {
    const res = await executeRequest(methods.GET, apiKeyUri);
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const resetApiKey = async () => {
    const res = await executeRequest(methods.PUT, apiKeyUri);
    switch (res.status) {
      case 200:
        setApiKey(res.data["key"]);
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const deleteApiKey = async () => {
    const res = await executeRequest(methods.DELETE, apiKeyUri);
    switch (res.status) {
      case 200:
        setApiKey("");
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  return {
    apiKey,
    resetApiKey,
    deleteApiKey,
  };
};

export { useApiKey };