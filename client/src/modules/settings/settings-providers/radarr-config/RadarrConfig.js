import { RowLayout } from "../../../../elements/layouts";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SubmitConfig } from "../SubmitConfig";
import { useRadarr } from "../../../../hooks/useRadarr";

const RadarrConfig = () => {
  const { register, handleSubmit, formState, reset, getValues } = useForm();
  const { testRadarrConfig, updateRadarrConfig, getRadarrConfig } = useRadarr();
  useEffect(() => {
    getRadarrConfig().then((data) => {
      if (data) reset(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="RadarrConfig" data-testid="RadarrConfig">
      <RowLayout
        justifyContent="space-between"
        borderBottom="1px solid LightGrey"
      >
        <h1 className="is-size-1">Radarr</h1>
      </RowLayout>
      <br />
      <div className="container">
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
                ref={register}
              />
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
                ref={register}
              />
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
    </div>
  );
};

export { RadarrConfig };