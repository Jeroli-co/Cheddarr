import React, {useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faEdit} from "@fortawesome/free-solid-svg-icons";
import {AuthContext} from "../../../../contexts/AuthContext";
import {ServersModal} from "./elements/ServersModal";
import {useForm} from "react-hook-form";
import {SubmitPlexConfig} from "./elements/SubmitPlexConfig";
import {usePlexConfig} from "../../../../hooks/usePlexConfig";

const PlexConfig = ({ location }) => {

  const { getPlexConfig, providerApiKey, machineName, loaded, enabled, updateConfig } = usePlexConfig();
  const [isServersModalActive, setIsServersModalActive] = useState(false);

  const { register, handleSubmit, formState, reset } = useForm();

  useEffect(() => {
    getPlexConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onSubmit = (data) => {
    updateConfig(data).then(res => { if (res) reset() });
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

  if (!loaded) return <div/>;

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
            <SubmitPlexConfig isFormDirty={formState.dirty}/>
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