import React, { createContext, useState } from 'react';
import axios from "axios";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

  const [user, setUser] = useState({
    isAuthenticated: false,
  });

  const signUp = (data) => {
    if (!user.isAuthenticated) {
      const fd = new FormData();
      fd.append('firstName', data['firstName']);
      fd.append('lastName', data['lastName']);
      fd.append('username', data['username']);
      fd.append('email', data['email']);
      fd.append('password', data['password']);
      axios.post('/api/sign-up', fd)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
          // 409 EXIST DEJA
          // 500 INTERNAL ERROR probleme de validation du form
        });
    }
  };

  const signIn = (data) => {
    if (!user.isAuthenticated) {
      const fd = new FormData();
      fd.append('usernameOrEmail', data['usernameOrEmail']);
      fd.append('password', data['password']);
      axios.post('/api/sign-in', fd)
        .then((res) => {
          console.log(res);
          setUser({isAuthenticated: true});
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const signOut = () => {
    if (user.isAuthenticated) {
      axios.get('/api/sign-out')
        .then((res) => {
          console.log(res);
          setUser({isAuthenticated: false});
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <AuthContext.Provider value={{...user, signUp, signIn, signOut}}>
      {props.children}
    </AuthContext.Provider>
  )
};

export default AuthContextProvider;