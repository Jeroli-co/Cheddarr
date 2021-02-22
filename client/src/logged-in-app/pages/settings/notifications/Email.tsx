import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IEmailConfig } from "../../../../shared/models/IEmailConfig";
import { SecondaryButton } from "../../../../shared/components/Button";
import { InputField } from "../../../../shared/components/inputs/InputField";
import { Icon } from "../../../../shared/components/Icon";
import {
  faAt,
  faEnvelope,
  faKey,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { H1 } from "../../../../shared/components/Titles";
import { Checkbox } from "../../../../shared/components/inputs/Checkbox";
import { Row } from "../../../../shared/components/layout/Row";
import { useAPI } from "../../../../shared/hooks/useAPI";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";
import { useAlert } from "../../../../shared/contexts/AlertContext";
import { ERRORS_MESSAGE } from "../../../../shared/enums/ErrorsMessage";
import { INotificationsConfig } from "../../../../shared/models/INotificationsConfig";

export const EmailConfig = () => {
  const { register, handleSubmit, reset } = useForm<IEmailConfig>();
  const { get, put } = useAPI();
  const { pushSuccess, pushDanger } = useAlert();

  const onSubmit = (data: IEmailConfig) => {
    const settings: INotificationsConfig = {
      enabled: data.enabled,
      settings: { ...data },
    };
    put(APIRoutes.PUT_EMAIL_SETTINGS, settings).then((res) => {
      if (res.status === 200) {
        pushSuccess("SMTP Server config saved");
      } else {
        pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
      }
    });
  };

  useEffect(() => {
    get<INotificationsConfig>(APIRoutes.GET_EMAIL_SETTINGS).then((res) => {
      if (res && res.data) {
        reset({ enabled: res.data.enabled, ...res.data.settings });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row justifyContent="space-between" alignItems="center">
        <H1>Email</H1>
        <InputField isInline>
          <label>Enabled</label>
          <Checkbox name="enabled" register={register} />
        </InputField>
      </Row>

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
            minLength={1000}
            maxLength={99999}
          />
        </InputField>
      </Row>

      <Row justifyContent="space-between" alignItems="center">
        <InputField withIcon width="49%">
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

        <InputField withIcon width="49%">
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
      </Row>

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

      <br />
      <SecondaryButton type="submit">Save</SecondaryButton>
    </form>
  );
};
