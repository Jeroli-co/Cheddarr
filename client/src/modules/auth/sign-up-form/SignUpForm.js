import React, { useContext, useEffect, useState } from "react";
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

const initialInfoState = {
  username: null,
  email: null,
  password: null,
  avatar: null,
};

const SignUpForm = () => {
  const [signUpInfo, setSignUpInfo] = useState(initialInfoState);
  const [currentState, setCurrentState] = useState(-1);
  const { signUp } = useContext(AuthContext);

  const onValidInput = (data) => {
    switch (currentState) {
      case SIGN_UP_STATES.USERNAME:
        setSignUpInfo({ ...signUpInfo, username: data.username });
        break;
      case SIGN_UP_STATES.EMAIL:
        setSignUpInfo({ ...signUpInfo, email: data.email });
        break;
      case SIGN_UP_STATES.PASSWORD:
        setSignUpInfo({ ...signUpInfo, password: data.password });
        break;
      case SIGN_UP_STATES.AVATAR:
        setSignUpInfo({ ...signUpInfo, avatar: data });
        break;
      default:
        console.log("No value matched");
    }
  };

  useEffect(() => {
    switch (currentState) {
      case -1:
        setCurrentState(SIGN_UP_STATES.USERNAME);
        break;
      case SIGN_UP_STATES.USERNAME:
        setCurrentState(SIGN_UP_STATES.EMAIL);
        break;
      case SIGN_UP_STATES.EMAIL:
        setCurrentState(SIGN_UP_STATES.PASSWORD);
        break;
      case SIGN_UP_STATES.PASSWORD:
        setCurrentState(SIGN_UP_STATES.AVATAR);
        break;
      case SIGN_UP_STATES.AVATAR:
        setCurrentState(SIGN_UP_STATES.IN_PROGRESS);
        break;
      default:
        console.log("No states matched");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signUpInfo]);

  useEffect(() => {
    if (currentState === SIGN_UP_STATES.IN_PROGRESS) {
      signUp(signUpInfo).then((res) => {
        if (res) {
          switch (res.status) {
            case 200:
              setCurrentState(SIGN_UP_STATES.SUCCESS);
              break;
            default:
              setCurrentState(SIGN_UP_STATES.ERROR);
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
        {currentState === SIGN_UP_STATES.USERNAME && (
          <UsernameInput
            onValidInput={onValidInput}
            defaultValue={signUpInfo.username}
          />
        )}
        {currentState === SIGN_UP_STATES.EMAIL && (
          <EmailInput
            onPrevious={() => setCurrentState(SIGN_UP_STATES.USERNAME)}
            onValidInput={onValidInput}
            defaultValue={signUpInfo.email}
          />
        )}
        {currentState === SIGN_UP_STATES.PASSWORD && (
          <PasswordInput
            onPrevious={() => setCurrentState(SIGN_UP_STATES.EMAIL)}
            onValidInput={onValidInput}
            defaultValue={signUpInfo.password}
          />
        )}
        {currentState === SIGN_UP_STATES.AVATAR && (
          <AvatarInput
            onPrevious={() => setCurrentState(SIGN_UP_STATES.PASSWORD)}
            onValidInput={onValidInput}
          />
        )}
        {currentState === SIGN_UP_STATES.IN_PROGRESS && <PageLoader />}
        {currentState === SIGN_UP_STATES.SUCCESS && <Success />}
        {currentState === SIGN_UP_STATES.ERROR && <Errors />}
        <br />
        <div className="content has-text-centered">
          <p>Step: {currentState + 1} / 4</p>
        </div>
      </ColumnLayout>
    </div>
  );
};

export { SignUpForm };
