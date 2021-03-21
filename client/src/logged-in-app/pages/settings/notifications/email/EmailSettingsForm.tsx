import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  faAt,
  faEnvelope,
  faKey,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { IEmailConfig } from "../../../../../shared/models/IEmailConfig";
import { INotificationsConfig } from "../../../../../shared/models/INotificationsConfig";
import { Row } from "../../../../../shared/components/layout/Row";
import { InputField } from "../../../../../shared/components/inputs/InputField";
import { Checkbox } from "../../../../../shared/components/inputs/Checkbox";
import { Icon } from "../../../../../shared/components/Icon";

type EmailSettingsFormProps = {
  config: INotificationsConfig | null;
};

export const EmailSettingsForm = (props: EmailSettingsFormProps) => {
  const { register, reset } = useFormContext<IEmailConfig>();

  useEffect(() => {
    if (props.config) {
      reset({ enabled: props.config.enabled, ...props.config.settings });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <InputField isInline>
        <label>Enabled</label>
        <Checkbox name="enabled" register={register} />
      </InputField>

      <Row justifyContent="space-between" alignItems="center">
        <InputField withIcon width="49%">
          <label>Hostname</label>
          <div className="with-left-icon">
            <input
              name="smtpHost"
              type="text"
              ref={register}
              placeholder="Hostname"
            />
            <span className="icon">
              <Icon icon={faAt} />
            </span>
          </div>
        </InputField>

        <InputField width="49%">
          <label>Port</label>
          <input
            name="smtpPort"
            type="number"
            placeholder="Port"
            ref={register({ minLength: 3, maxLength: 5 })}
            maxLength={65535}
          />
        </InputField>
      </Row>

      <InputField withIcon>
        <label>Username</label>
        <div className="with-left-icon">
          <input
            name="smtpUser"
            type="text"
            ref={register}
            placeholder="Username"
          />
          <span className="icon">
            <Icon icon={faUser} />
          </span>
        </div>
      </InputField>

      <InputField withIcon>
        <label>Password</label>
        <div className="with-left-icon">
          <input
            name="smtpPassword"
            type="password"
            ref={register}
            placeholder="Password"
          />
          <span className="icon">
            <Icon icon={faKey} />
          </span>
        </div>
      </InputField>

      <InputField withIcon>
        <label>Sender address</label>
        <div className="with-left-icon">
          <input
            name="senderAddress"
            type="email"
            ref={register}
            placeholder="Email"
          />
          <span className="icon">
            <Icon icon={faEnvelope} />
          </span>
        </div>
      </InputField>

      <InputField>
        <label>Sender name</label>
        <input
          name="senderName"
          type="text"
          ref={register}
          placeholder="Sender name"
        />
      </InputField>

      <br />

      <InputField isInline={true}>
        <label>SSL</label>
        <Checkbox name="ssl" register={register} round />
      </InputField>
    </>
  );
};
