import { AuthContext } from "../../auth/contexts/AuthContext";
import { useContext } from "react";
import { NotificationContext } from "../../notifications/contexts/NotificationContext";
import { UserService } from "../services/UserService";
import { UserModel } from "../models/UserModel";
import { HttpServiceResponseModel } from "../../api/models/HttpServiceResponseModel";

const useUserService = () => {
  const { updateUsername } = useContext(AuthContext);
  const { pushSuccess } = useContext(NotificationContext);

  const changeUsername = async (data) => {
    const httpResponse = await UserService.changeUsername(data);
    if (httpResponse instanceof HttpServiceResponseModel) {
      const user = httpResponse.data;
      if (user instanceof UserModel) {
        updateUsername(httpResponse.data.username);
        pushSuccess("Username has changed");
      }
    }
    return httpResponse;
  };

  return {
    changeUsername,
  };
};

export { useUserService };
