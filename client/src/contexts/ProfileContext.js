import React, {createContext, useContext, useState} from 'react';
import axios from "axios";
import {AuthContext} from "./AuthContext";
import {routes} from "../router/routes";
import {createErrorResponse, createResponse} from "../service/http-service";

const ProfileContext = createContext();

const ProfileContextProvider = (props) => {

  const initialState = {
    email: ""
  };

  const apiProfileUrl = "/api/profile/";

  const { handleError, clearSession, updateUsername, updatePicture } = useContext(AuthContext);
  const [user, setUser] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const changePassword = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('oldPassword', data['oldPassword']);
    fd.append('newPassword', data['newPassword']);
    try {
      const res = await axios.put(apiProfileUrl + "password/", fd);
      clearSession();
      props.history.push(routes.SIGN_IN.url);
      return createResponse(res);
    } catch (e) {
      handleError(e, [400]);
      return createErrorResponse(e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('password', data['password']);
    try {
      const res = await axios.delete(apiProfileUrl, { data: fd });
      clearSession();
      props.history.push(routes.SIGN_UP.url);
      return createResponse(res);
    } catch (e) {
      handleError(e, [400]);
      return createErrorResponse(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileContext.Provider value={{
      ...user,
      changePassword,
      deleteAccount
    }}>
      { props.children }
    </ProfileContext.Provider>
  );
};

export {
  ProfileContext,
  ProfileContextProvider
}