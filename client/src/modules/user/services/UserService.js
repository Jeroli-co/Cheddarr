import { HttpService } from "../../api/services/HttpService";
import { HTTP_METHODS } from "../../api/enums/HttpMethods";
import { UserModel } from "../models/UserModel";
import { ERRORS_MESSAGE } from "../../../utils/enums/ErrorsMessage";
import { PublicUserModel } from "../models/PublicUserModel";
import { HttpServiceResponseModel } from "../../api/models/HttpServiceResponseModel";

class UserService {
  static CURRENT_USER_BASE_URL = "/user";
  static USERS_BASE_URL = "/users/";

  static getCurrentUser = async () => {
    return HttpService.executeRequest(
      HTTP_METHODS.GET,
      this.CURRENT_USER_BASE_URL
    ).then(
      (response) => {
        if (response.status === 200) {
          const user = new UserModel(
            response.data.username,
            response.data.email,
            response.data.avatar,
            response.data.confirmed,
            response.data.admin
          );
          return new HttpServiceResponseModel(user, response.status, null);
        } else {
          return new HttpServiceResponseModel(
            null,
            response.status,
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new HttpServiceResponseModel(
          null,
          error.response.status,
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };

  static getPublicUser = async (id) => {
    return HttpService.executeRequest(
      HTTP_METHODS.GET,
      this.USERS_BASE_URL + id
    ).then(
      (response) => {
        if (response.status === 200) {
          const publicUser = new PublicUserModel(
            response.data.username,
            response.data.email,
            response.data.avatar
          );
          return new HttpServiceResponseModel(
            publicUser,
            response.status,
            null
          );
        } else {
          return new HttpServiceResponseModel(
            null,
            response.status,
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new HttpServiceResponseModel(
          null,
          error.response.status,
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };

  static changeUsername = async (username) => {
    return await HttpService.executeRequest(
      HTTP_METHODS.PUT,
      this.CURRENT_USER_BASE_URL,
      username
    ).then(
      (response) => {
        if (response.status === 200) {
          const user = new UserModel(
            response.data.username,
            response.data.email,
            response.data.avatar,
            response.data.confirmed,
            response.data.admin
          );
          return new HttpServiceResponseModel(user, response.status, null);
        } else {
          return new HttpServiceResponseModel(
            null,
            response.status,
            ERRORS_MESSAGE.UNHANDLED_STATUS(response.status)
          );
        }
      },
      (error) => {
        return new HttpServiceResponseModel(
          null,
          error.response.status,
          ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
        );
      }
    );
  };
}

export { UserService };
