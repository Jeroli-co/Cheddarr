import React, {useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faEdit} from "@fortawesome/free-solid-svg-icons";
import {AuthContext} from "../../../../../contexts/AuthContext";
import {ServersModal} from "./ServersModal";
import {PlexConfigContext} from "../../../../../contexts/PlexConfigContext";
import {useForm} from "react-hook-form";
import styled, {keyframes} from "styled-components";

const PlexConfig = ({ location }) => {

  const { providerApiKey, machineName, loading, enabled, updateConfig } = useContext(PlexConfigContext);
  const [isServersModalActive, setIsServersModalActive] = useState(false);

  const { register, handleSubmit, formState } = useForm();
  const [hasFormValueChanged, setHasFormValueChanged] = useState(false);

  useEffect(() => {
    if (formState.dirty) {
      setHasFormValueChanged(true);
    }
  }, [formState.dirty]);

  const fadeInUp = keyframes`
    from {
      opacity: 0;
      margin-bottom: -60px;
    }
    
    to {
      opacity: 1;
      margin-bottom: 0px;
    }
  `;

  const fadeOutDown = keyframes`
    from {
      opacity: 1;
      margin-bottom: 0px;
    }
    
    to {
      opacity: 0;
      margin-bottom: -60px;
    }
  `;

  const SubmitContainer = styled.div`
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid lightgrey;
    background-color: #f7f7f7;
    opacity: 0;
    animation: ${props => props.hasFormValueChanged ? 
      (props.dirty ? fadeInUp : fadeOutDown) : 
      'none'
    } 1s linear forwards; 
  `;

  const SubmitButton = styled.button`
    background: transparent;
    border-radius: 3px;
    border: 2px solid mediumseagreen;
    background-color: white;
    color: mediumseagreen;
    margin: 0 1em;
    padding: 0.25em 1em;
    font-size: 1em;
    width: 150px;
    height: 40px;
    
    &:hover {
      cursor: pointer;
      color: white;
      background-color: mediumseagreen;
    }
  `;

  const _onSubmit = (data) => {
    console.log(data);
    updateConfig(data);
  };

  const isPlexAccountLinked = () => {
    return providerApiKey !== null && typeof providerApiKey !== 'undefined';
  };

  const isPlexServerLinked = () => {
    return machineName !== null && typeof machineName !== 'undefined';
  };

  const LinkPlexAccount = () => {

    const { signInWithPlex } = useContext(AuthContext);

    if (!isPlexAccountLinked()) {
      return (
        <button className="button is-primary" type="button" onClick={() => signInWithPlex(location.pathname)}>
          Link Plex account
        </button>
      );
    }

    return (
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item has-text-success">
            <FontAwesomeIcon icon={faCheck}/>
          </div>
          <div className="level-item">
            <p className="is-size-5 is-size-7-mobile has-text-weight-light">Plex account linked</p>
          </div>
        </div>
      </div>
    );

  };

  const LinkPlexServer = () => {
    return (
      <div className="level is-mobile">
        { isPlexServerLinked() &&
          <div className="level-left">
            <div className="level-item has-text-success">
              <FontAwesomeIcon icon={faCheck}/>
            </div>
            <div className="level-item">
              <p className="is-size-5 is-size-7-mobile has-text-weight-light">Plex server linked ({machineName})</p>
            </div>
            <div className="level-item">
              <button type="button" className="button is-small is-rounded is-info" onClick={() => setIsServersModalActive(true)}>
                <FontAwesomeIcon icon={faEdit}/>
              </button>
            </div>
          </div>
        }
        { !isPlexServerLinked() &&
          <div className="level-left">
            <div className="level-item">
              <button className="button is-primary" type="button" onClick={() => setIsServersModalActive(true)}>
                Link Plex server
              </button>
            </div>
          </div>
        }
      </div>
    );
  };

  if (loading) return <div/>;

  return (
    <div className="PlexConfig" data-testid="PlexConfig">

      <form onSubmit={handleSubmit(_onSubmit)}>

        { isPlexAccountLinked() &&
          <div className="field">
            <div className="control">
              <input id="enabled"
                     type="checkbox"
                     name="enabled"
                     className="switch is-primary"
                     ref={register}
                     defaultChecked={enabled}
              />
              <label htmlFor="enabled">Enabled</label>
            </div>
            <hr/>
          </div>
        }

        <LinkPlexAccount/>

        { isPlexAccountLinked() &&
          <div>
            <LinkPlexServer/>

            <SubmitContainer hasFormValueChanged={hasFormValueChanged} dirty={formState.dirty}>
              <SubmitButton type="submit">
                Save changes
              </SubmitButton>
            </SubmitContainer>

          </div>
        }

      </form>

      { isServersModalActive && <ServersModal onClose={() => setIsServersModalActive(false)}/> }

    </div>
  );
};

export {
  PlexConfig
}