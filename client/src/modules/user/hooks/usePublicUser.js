import { useEffect, useState } from "react";
import { UserService } from "../services/UserService";
import { PublicUserModel } from "../models/PublicUserModel";

const usePublicUser = (id) => {
  const [publicUser, setPublicUser] = useState(null);

  useEffect(() => {
    UserService.getPublicUser(id).then((httpServiceResponseModel) => {
      if (httpServiceResponseModel.data instanceof PublicUserModel) {
        setPublicUser(httpServiceResponseModel.data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return publicUser;
};

export { usePublicUser };
