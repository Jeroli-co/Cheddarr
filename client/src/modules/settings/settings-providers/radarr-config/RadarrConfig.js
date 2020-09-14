import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RowLayout } from "../../../../elements/layouts";
import { FORM_DEFAULT_VALIDATOR } from "../../../../forms/formDefaultValidators";
import { useRadarr } from "../../../../hooks/useRadarr";
import { SubmitConfig } from "../SubmitConfig";
import { isEmptyObject } from "../../../../utils/objects";

const RadarrConfig = () => {
  const {
    register,
    handleSubmit,
    formState,
    reset,
    getValues,
    errors,
  } = useForm();

  const {
    testRadarrConfig,
    updateRadarrConfig,
    getRadarrConfig,
    getRadarrRootFolders,
    getRadarrProfiles,
  } = useRadarr();
  const [rootFolders, setRootFolders] = useState(null);
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    getRadarrConfig().then((data) => {
      console.log(data);
      if (data) {
        reset(data);
        if (!isEmptyObject(data)) {
          getRadarrRootFolders().then((data) => {
            if (data) setRootFolders(data);
          });
          /*
          getRadarrProfiles().then((data) => {
            if (data) setProfiles(data);
          });
           */
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(rootFolders);
    console.log(profiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const _onSubmit = (data) => {
    let newConfig = {};
    formState.dirtyFields.forEach((key) => {
      newConfig[key] = data[key];
    });
    updateRadarrConfig(newConfig).then((res) => {
      if (res) reset(res.data);
    });
  };

  return (
    <div className="RadarrConfig container" data-testid="RadarrConfig">
      <RowLayout
        justifyContent="space-between"
        borderBottom="1px solid LightGrey"
      >
        <h1 className="is-size-1">Radarr</h1>
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
        <SubmitConfig isFormDirty={formState.dirty} />
      </form>
      <div className="field">
        <div className="control">
          <button
            className="button is-secondary-button"
            onClick={() => testRadarrConfig(getValues())}
          >
            Test
          </button>
        </div>
      </div>
    </div>
  );
};

export { RadarrConfig };
