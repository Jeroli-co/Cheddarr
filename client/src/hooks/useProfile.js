import {useContext, useEffect, useState} from "react";
import {APIContext, methods} from "../contexts/APIContext";
import {AuthContext} from "../contexts/AuthContext";

const useProfile = () => {
  
  const profileURI = '/profile/';
  const { executeRequest } = useContext(APIContext);
  const { handleError, updateUsername, updatePicture } = useContext(AuthContext);

  const [user, setUser] = useState(null);

  useEffect(() => {
    executeRequest(methods.GET, profileURI).then(res => setUser(res.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeEmail = async (data) => {
    const fd = new FormData();
    fd.append('email', data['email']);
    const res = await executeRequest(methods.PUT, profileURI + 'email/', fd);
    switch (res.status) {
      case 200:
      case 409:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const changeUsername = async (data) => {
    const fd = new FormData();
    fd.append('username', data['newUsername']);
    const res = await executeRequest(methods.PUT, profileURI + "username/", fd);
    switch (res.status) {
      case 200:
        const username = res.data.username;
        updateUsername(username);
        setUser({...user, username: username});
        return res;
      case 409:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const changeUserPicture = async (data) => {
    const fd = new FormData();
    fd.append('picture', data);
    const res = await executeRequest(methods.PUT, profileURI + "picture/", fd, { 'content-type': 'multipart/form-data' });
    switch (res.status) {
      case 200:
        const userPicture = res.data["user_picture"];
        updatePicture(userPicture);
        setUser({...user, user_picture: userPicture});
        return res;
      default:
        handleError(res);
        return res;
    }
  };

  return {
    user,
    changeEmail,
    changeUsername,
    changeUserPicture
  }
};

export {
  useProfile
}