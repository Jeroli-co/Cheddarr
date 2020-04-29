import { RowLayout } from "../../../../elements/layouts";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SubmitConfig } from "../SubmitConfig";
import { useRadarr } from "../../../../hooks/useRadarr";

const RadarrConfig = () => {
  const [sslEnabled, setSslEnabled] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm();
  const { getRadarrConfig, updateRadarrConfig } = useRadarr();

  const _onSubmit = (data) => {
    let newConfig = {};
    formState.dirtyFields.forEach((key) => {
      newConfig[key] = data[key];
    });
    updateRadarrConfig(newConfig).then((res) => {
      if (res) reset();
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

      <div className="container">
        <form id="radarr-config-form" onSubmit={handleSubmit(_onSubmit)}>
          <div className="field">
            <label className="label">API Key</label>
            <div className="control has-icons-left">
              <input
                name="apiKey"
                className={"input is-medium "}
                type="text"
                placeholder="API Key"
                ref={register}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Hostname or IP Address</label>
            <div className="control has-icons-left">
              <input
                name="host"
                className={"input is-medium "}
                type="text"
                placeholder="Hostname or IP"
                ref={register}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Port Number</label>
            <div className="control has-icons-left">
              <input
                name="port"
                className={"input is-medium "}
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
                checked={sslEnabled}
                onChange={() => setSslEnabled(!sslEnabled)}
                ref={register}
              />
              <label htmlFor="ssl">SSL Enabled</label>
            </div>
          </div>
          <SubmitConfig isFormDirty={formState.dirty} />
        </form>
      </div>
    </div>
  );
};

export { RadarrConfig };
