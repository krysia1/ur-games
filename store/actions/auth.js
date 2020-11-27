import { AsyncStorage } from "react-native";

export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const AUTH = "AUTH";
export const LOGOUT = "LOGOUT";

let timer;

import ENV from '../../env';

export const auth = (userId, token, expTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expTime));
    dispatch({ type: AUTH, payload: { userId: userId, token: token } });
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${ENV.googleAuthApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Sth went wrong!";
      if (errorId === "EMAIL_EXISTS") {
        message = " The email address is already in use by another account";
      } else if (errorId === "OPERATION_NOT_ALLOWED") {
        message = "Password sign-in is disabled for this project!";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    dispatch(
      auth(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000)
    );
    const expDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAaKfGsCAc4oNxNLYvoRPXgfmeIa9_SKaY",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Sth went wrong!";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "There is no user record corresponding to this identifier!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "The password is invalid!";
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(
      auth(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000)
    );
    const expDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      console.log('LOGOUT!');
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expDate: expDate.toISOString(),
    })
  );
};
