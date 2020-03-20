import React, {useContext} from 'react';
import {useForm} from "react-hook-form";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from "@fortawesome/free-solid-svg-icons";
import {routes} from "../../../routes";
import {AuthContext} from "../../../context/AuthContext";
import {useLocation} from "react-router";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ConfirmPasswordModal = (props) => {

  const query = useQuery();
  const { register, handleSubmit, reset } = useForm();
  const { username, signIn } = useContext(AuthContext);

  const _onSubmit = (data) => {
    signIn({username: username, password: data.password}).then((code) => {
      reset();
      props.history.push(code === 200 ? query.get("redirect") : routes.SIGN_IN.url);
    });
  };

  return (
    <div className={'ConfirmPasswordModal modal is-active'} data-testid="ConfirmPasswordModal">
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Confirm your password</p>
        </header>
        <form onSubmit={handleSubmit(_onSubmit)}>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Password</label>
              <div className="control has-icons-left">
                <input name="password"
                       className="input"
                       type="password"
                       placeholder="Enter your password"
                       ref={register} />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-secondary-button">Confirm password</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export {
  ConfirmPasswordModal
}