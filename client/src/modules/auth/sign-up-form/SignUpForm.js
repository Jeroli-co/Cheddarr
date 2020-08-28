import React, { useContext, useEffect, useReducer } from "react";
import { UsernameInput } from "./UsernameInput";
import { EmailInput } from "./EmailInput";
import { AuthContext } from "../../../contexts/AuthContext";
import { ColumnLayout } from "../../../elements/layouts";
import { PasswordInput } from "./PasswordInput";
import { AvatarInput } from "./AvatarInput";
import { Success } from "./Success";
import { PageLoader } from "../../../elements/PageLoader";
import { Errors } from "./Errors";

const SIGN_UP_STATES = {
  USERNAME: 0,
  EMAIL: 1,
  PASSWORD: 2,
  AVATAR: 3,
  IN_PROGRESS: 4,
  SUCCESS: 5,
  ERROR: 6,
};

const initialState = {
  current: 0,
  user: {
    username: null,
    email: null,
    password: null,
    avatar: null,
  },
};

function init(initialState) {
  return initialState;
}

function reducer(state, action) {
  switch (action.type) {
    case "backFromEmail":
      return {
        ...state,
        current: SIGN_UP_STATES.USERNAME,
      };
    case "goToEmail":
      return {
        user: { ...state.user, username: action.payload.username },
        current: SIGN_UP_STATES.EMAIL,
      };
    case "backFromPassword":
      return {
        ...state,
        current: SIGN_UP_STATES.EMAIL,
      };
    case "goToPassword":
      return {
        user: { ...state.user, email: action.payload.email },
        current: SIGN_UP_STATES.PASSWORD,
      };
    case "backFromAvatar":
      return {
        ...state,
        current: SIGN_UP_STATES.PASSWORD,
      };
    case "goToAvatar":
      return {
        user: { ...state.user, password: action.payload.password },
        current: SIGN_UP_STATES.AVATAR,
      };
    case "validate":
      return {
        user: { ...state.user, avatar: action.payload.avatar },
        current: SIGN_UP_STATES.IN_PROGRESS,
      };
    case "goToSuccess":
      return {
        ...state,
        current: SIGN_UP_STATES.SUCCESS,
      };
    case "goToErrors":
      return {
        ...state,
        current: SIGN_UP_STATES.ERROR,
      };
    default:
      throw new Error("No action type matched");
  }
}

const SignUpForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const { signUp } = useContext(AuthContext);

  const onValidInput = (data) => {
    switch (state.current) {
      case SIGN_UP_STATES.USERNAME:
        dispatch({ type: "goToEmail", payload: { username: data.username } });
        break;
      case SIGN_UP_STATES.EMAIL:
        dispatch({ type: "goToPassword", payload: { email: data.email } });
        break;
      case SIGN_UP_STATES.PASSWORD:
        dispatch({ type: "goToAvatar", payload: { password: data.password } });
        break;
      case SIGN_UP_STATES.AVATAR:
        dispatch({ type: "validate", payload: { avatar: data } });
        break;
      default:
        console.log("No value matched");
    }
  };

  useEffect(() => {
    if (state.current === SIGN_UP_STATES.IN_PROGRESS) {
      signUp(state.user).then((res) => {
        if (res) {
          switch (res.status) {
            case 200:
              dispatch({ type: "goToSuccess" });
              break;
            default:
              dispatch({ type: "goToErrors" });
          }
        }
      });
    }
  });

  return (
    <div className="SignUpForm" data-testid="SignUpForm">
      <div className="hero is-primary">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">
              <p>
                Create a <span className="has-text-secondary">Cheddarr</span>{" "}
                account
              </p>
            </h1>
          </div>
        </div>
      </div>

      <br />

      <ColumnLayout alignItems="center">
        {state.current === SIGN_UP_STATES.USERNAME && (
          <UsernameInput
            onValidInput={onValidInput}
            defaultValue={state.user.username}
          />
        )}
        {state.current === SIGN_UP_STATES.EMAIL && (
          <EmailInput
            onPrevious={() => dispatch({ type: "backFromEmail" })}
            onValidInput={onValidInput}
            defaultValue={state.user.email}
          />
        )}
        {state.current === SIGN_UP_STATES.PASSWORD && (
          <PasswordInput
            onPrevious={() => dispatch({ type: "backFromPassword" })}
            onValidInput={onValidInput}
            defaultValue={state.user.password}
          />
        )}
        {state.current === SIGN_UP_STATES.AVATAR && (
          <AvatarInput
            onPrevious={() => dispatch({ type: "backFromAvatar" })}
            onValidInput={onValidInput}
          />
        )}
        {state.current === SIGN_UP_STATES.IN_PROGRESS && <PageLoader />}
        {state.current === SIGN_UP_STATES.SUCCESS && <Success />}
        {state.current === SIGN_UP_STATES.ERROR && <Errors />}
        <br />
        <div className="content has-text-centered">
          <p>Step: {state.current + 1} / 4</p>
        </div>
      </ColumnLayout>
    </div>
  );
};

export { SignUpForm };
