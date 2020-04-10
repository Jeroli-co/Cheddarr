import React, {useContext, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faEdit, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {AuthContext} from "../../../../contexts/AuthContext";
import {ServersModal} from "./elements/ServersModal";
import {useForm} from "react-hook-form";
import {SubmitPlexConfig} from "./elements/SubmitPlexConfig";
import {PlexConfigContext} from "../../../../contexts/PlexConfigContext";

const PlexConfig = ({ location }) => {

  const { config, updateConfig } = useContext(PlexConfigContext);
  const [isServersModalActive, setIsServersModalActive] = useState(false);

  const { register, handleSubmit, formState, reset } = useForm();

  const _onSubmit = (data) => {
    let newConfig = {};
    formState.dirtyFields.forEach(key => {
      newConfig[key] = data[key];
    });
    updateConfig(newConfig).then(res => { if (res) reset() });
  };

  const isPlexAccountLinked = () => {
    return config["provider_api_key"] !== null && typeof config["provider_api_key"] !== 'undefined';
  };

  const isPlexServerLinked = () => {
    return config["machine_name"] !== null && typeof config["machine_name"] !== 'undefined';
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
              <p className="is-size-5 is-size-7-mobile has-text-weight-light">Plex server linked ({config["machine_name"]})</p>
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

  return (
    <div className="PlexConfig" data-testid="PlexConfig">

      <h1 className="title is-1">Plex</h1>
      <hr/>

      { !config &&
        <div className="content has-text-primary">
          <FontAwesomeIcon icon={faSpinner} pulse size="2x"/>
        </div>
      }

      { config && (

        <div className="container">
          <form onSubmit={handleSubmit(_onSubmit)}>

            { isPlexAccountLinked() &&
              <div className="field">
                <div className="control">
                  <input id="enabled"
                         type="checkbox"
                         name="enabled"
                         className="switch is-primary"
                         ref={register}
                         defaultChecked={config.enabled}
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
                <SubmitPlexConfig isFormDirty={formState.dirty}/>
              </div>
            }

          </form>

          { isServersModalActive && <ServersModal onClose={() => setIsServersModalActive(false)}/> }

        </div>

      )}

    </div>
  );
};

export {
  PlexConfig
}
