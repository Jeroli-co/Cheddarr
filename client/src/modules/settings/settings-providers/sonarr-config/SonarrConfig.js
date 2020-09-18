import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RowLayout } from "../../../../elements/layouts";
import { FORM_DEFAULT_VALIDATOR } from "../../../../forms/formDefaultValidators";
import { useSonarr } from "../../../../hooks/useSonarr";
import { isEmptyObject } from "../../../../utils/objects";

const SonarrConfig = () => {
  const { register, handleSubmit, reset, getValues, errors } = useForm();
  const { testSonarrConfig, updateSonarrConfig, getSonarrConfig } = useSonarr();
  const [requestsConfig, setRequestsConfig] = useState(null);
  useEffect(() => {
    getSonarrConfig().then((data) => {
      if (data) {
        if (!isEmptyObject(data)) {
          reset(data);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const testConfig = (data) => {
    testSonarrConfig(data).then((c) => {
      if (c) setRequestsConfig(c);
    });
  };

  const isVersionThree = (config) => {
    return config.version[0] === "3";
  };

  return (
    <div className="SonarrConfig container" data-testid="SonarrConfig">
      <RowLayout borderBottom="1px solid LightGrey">
        <h1 className="is-size-1">Sonarr</h1>
      </RowLayout>
      <br />
      <form
        id="radarr-config-form"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onSubmit={handleSubmit(updateSonarrConfig)}
      >
        <div className="field">
          <div className="control">
            <input
              id="enabled"
              type="checkbox"
              name="enabled"
              className="switch is-primary"
              ref={register}
            />
            <label htmlFor="enabled">Enabled</label>
          </div>
        </div>
        <div className="field">
          <label className="label">API Key</label>
          <div className="control">
            <input
              name="api_key"
              className="input"
              type="text"
              placeholder="API Key"
              ref={register({
                required: true,
              })}
            />
            {errors["api_key"] && errors["api_key"].type === "required" && (
              <p className="help is-danger">
                {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
              </p>
            )}
          </div>
        </div>
        <div className="field">
          <label className="label">Hostname or IP Address</label>
          <div className="control">
            <input
              name="host"
              className="input"
              type="text"
              placeholder="Hostname or IP"
              ref={register({
                required: true,
              })}
            />
            {errors["host"] && errors["host"].type === "required" && (
              <p className="help is-danger">
                {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
              </p>
            )}
          </div>
        </div>
        <div className="field">
          <label className="label">Port Number</label>
          <div className="control">
            <input
              name="port"
              className="input"
              type="text"
              placeholder="Port"
              ref={register}
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <input
              id="ssl"
              type="checkbox"
              name="ssl"
              className="switch is-rounded is-small"
              ref={register}
            />
            <label htmlFor="ssl">SSL</label>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button
              type="button"
              className="button is-secondary-button"
              onClick={() => testConfig(getValues())}
            >
              Test
            </button>
          </div>
        </div>
        {requestsConfig && (
          <div>
            <div className="is-divider is-primary" />
            <RowLayout borderBottom="1px solid LightGrey">
              <h3 className="is-size-4">Requests configurations</h3>
            </RowLayout>
            <br />
          </div>
        )}
        {requestsConfig && (
          <div className="field">
            <label className="label">Default Root Folder</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="root_folder" ref={register}>
                  {requestsConfig["root_folders"].map((rf, index) => (
                    <option key={index} value={rf}>
                      {rf}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {requestsConfig && (
          <div className="field">
            <label className="label">Default Root Folder (Anime)</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="anime_root_folder" ref={register}>
                  {requestsConfig["root_folders"].map((rf, index) => (
                    <option key={index} value={rf}>
                      {rf}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {requestsConfig && (
          <div className="field">
            <label className="label">Default Quality Profile</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="quality_profile_id" ref={register}>
                  {requestsConfig["quality_profiles"].map((p, index) => (
                    <option key={index} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {requestsConfig && (
          <div className="field">
            <label className="label">Default Quality Profile (Anime)</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="anime_quality_profile_id" ref={register}>
                  {requestsConfig["quality_profiles"].map((p, index) => (
                    <option key={index} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {requestsConfig && isVersionThree(requestsConfig) && (
          <div className="field">
            <label className="label">Default Language Profile</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="language_profile_id" ref={register}>
                  {requestsConfig["language_profiles"].map((l, index) => (
                    <option key={index} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {requestsConfig && isVersionThree(requestsConfig) && (
          <div className="field">
            <label className="label">Default Language Profile (Anime)</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="anime_language_profile_id" ref={register}>
                  {requestsConfig["language_profiles"].map((l, index) => (
                    <option key={index} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {requestsConfig && (
          <div className="field">
            <div className="control">
              <button
                type="submit"
                className="button is-primary is-outlined is-fullwidth"
              >
                Save changes
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export { SonarrConfig };
