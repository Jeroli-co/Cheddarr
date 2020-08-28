import React, { useContext, useEffect, useState } from "react";
import { UsernameInput } from "./UsernameInput";
import { EmailInput } from "./EmailInput";
import { AuthContext } from "../../../contexts/AuthContext";
import { ColumnLayout } from "../../../elements/layouts";
import { PasswordInput } from "./PasswordInput";
import { PictureInput } from "./PictureInput";
import { OperationConfirmed } from "./OperationConfirmed";

const initialState = {
  username: null,
  email: null,
  password: null,
  picture: null,
};

const SignUpForm = () => {
  const [signUpInfo, setSignUpInfo] = useState(initialState);
  const [currentState, setCurrentState] = useState(-1);
  const { signUp } = useContext(AuthContext);

  const previous = () => {
    if (currentState > 0) {
      setCurrentState(currentState - 1);
    }
  };

  const onValidInput = (data) => {
    switch (currentState) {
      case 0:
        setSignUpInfo({ ...signUpInfo, username: data.username });
        break;
      case 1:
        setSignUpInfo({ ...signUpInfo, email: data.email });
        break;
      case 2:
        setSignUpInfo({ ...signUpInfo, password: data.password });
        break;
      case 3:
        setSignUpInfo({ ...signUpInfo, picture: data.picture });
        break;
      default:
        console.log("No value matched");
    }
  };

  useEffect(() => {
    setCurrentState((c) => c + 1);
  }, [signUpInfo]);

  const onSignUp = () => {
    console.log(signUpInfo);
    signUp(signUpInfo).then((res) => {
      if (res) {
        switch (res.status) {
          case 200:
            console.log("200");
            break;
          default:
            console.log("No match");
        }
      }
    });
  };

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
        {currentState === 0 && (
          <UsernameInput
            onValidInput={onValidInput}
            defaultValue={signUpInfo.username}
          />
        )}
        {currentState === 1 && (
          <EmailInput
            onPrevious={previous}
            onValidInput={onValidInput}
            defaultValue={signUpInfo.email}
          />
        )}
        {currentState === 2 && (
          <PasswordInput
            onPrevious={previous}
            onValidInput={onValidInput}
            defaultValue={signUpInfo.password}
          />
        )}
        {currentState === 3 && (
          <PictureInput onPrevious={previous} onValidInput={onSignUp} />
        )}
        {currentState === 4 && <OperationConfirmed />}
        <br />
        <div className="content has-text-centered">
          <p>Step: {currentState + 1} / 4</p>
        </div>
      </ColumnLayout>
    </div>
  );
};

export { SignUpForm };
