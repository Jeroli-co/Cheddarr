import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RowLayout } from "../../../../elements/layouts";
import { FORM_DEFAULT_VALIDATOR } from "../../../../forms/formDefaultValidators";
import { useSonarr } from "../../../../hooks/useSonarr";
import { isEmptyObject } from "../../../../utils/objects";

const SonarrConfig = () => {
  const {
    register,
    handleSubmit,
    formState,
    reset,
    getValues,
    errors,
    watch,
  } = useForm();
  const {
    testSonarrConfig,
    updateSonarrConfig,
    getSonarrConfig,
    getSonarrRootFolders,
    getSonarrProfiles,
    getSonarrLanguages,
  } = useSonarr();
  const [rootFolders, setRootFolders] = useState(null);
  const [profiles, setProfiles] = useState(null);
  const [languages, setLanguages] = useState(null);
  const watchV3 = watch("v3");
  useEffect(() => {
    getSonarrConfig().then((data) => {
      if (data) {
        reset(data);
        if (!isEmptyObject(data)) {
          getSonarrRootFolders().then((data) => {
            if (data) setRootFolders(data);
          });
          getSonarrProfiles().then((data) => {
            if (data) setProfiles(data);
          });
          getSonarrLanguages().then((data) => {
            if (data) setLanguages(data);
          });
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onSubmit = (data) => {
    let newConfig = {};
    formState.dirtyFields.forEach((key) => {
      newConfig[key] = data[key];
    });
    updateSonarrConfig(newConfig);
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
        onSubmit={handleSubmit(_onSubmit)}
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
            <label htmlFor="ssl">SSL Enabled</label>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button
              className="button is-secondary-button"
              onClick={() => testSonarrConfig(getValues())}
            >
              Test
            </button>
          </div>
        </div>
        <div className="is-divider is-primary" />
        <RowLayout borderBottom="1px solid LightGrey">
          <h3 className="is-size-3">Requests config</h3>
        </RowLayout>
        <br />
        {rootFolders && (
          <div className="field">
            <label className="label">Root folder</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="root_folder" ref={register}>
                  {rootFolders.map((rf, index) => (
                    <option key={index} value={rf}>
                      {rf}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {rootFolders && (
          <div className="field">
            <label className="label">Anime root folder</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="anime_root_folder" ref={register}>
                  {rootFolders.map((rf, index) => (
                    <option key={index} value={rf}>
                      {rf}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {profiles && (
          <div className="field">
            <label className="label">Series profiles</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="quality_profile_id" ref={register}>
                  {profiles.map((p, index) => (
                    <option key={index} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {profiles && (
          <div className="field">
            <label className="label">Anime profiles</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="anime_quality_profile_id" ref={register}>
                  {profiles.map((p, index) => (
                    <option key={index} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        <div className="field">
          <div className="control">
            <input
              id="v3"
              type="checkbox"
              name="v3"
              className="switch is-rounded is-small"
              ref={register}
            />
            <label htmlFor="v3">V3</label>
          </div>
        </div>
        {languages && watchV3 && (
          <div className="field">
            <label className="label">Language</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="language_profile_id" ref={register}>
                  {languages.map((l, index) => (
                    <option key={index} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {languages && watchV3 && (
          <div className="field">
            <label className="label">Anime language</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="anime_language_profile_id" ref={register}>
                  {languages.map((l, index) => (
                    <option key={index} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
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
      </form>
    </div>
  );
};

export { SonarrConfig };
