import { useEffect, useState } from "react";
import { UserService } from "../services/UserService";
import { UserModel } from "../models/UserModel";

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    UserService.getCurrentUser().then((httpServiceResponseModel) => {
      if (httpServiceResponseModel.data instanceof UserModel) {
        setCurrentUser(httpServiceResponseModel.data);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    });
  }, []);

  return currentUser;
};

export { useCurrentUser };
