import { useState } from "react";
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { FORM_DEFAULT_VALIDATOR } from "../shared/enums/FormDefaultValidators";
import { ISignInFormData } from "../shared/models/ISignInFormData";
import { useAuthentication } from "../shared/contexts/AuthenticationContext";
import { PrimaryHero } from "../shared/components/layout/Hero";
import { PlexButton } from "../shared/components/PlexButton";
import { SecondaryButton } from "../shared/components/Button";
import { PrimaryDivider } from "../shared/components/Divider";
import { usePlexAuth } from "../shared/contexts/PlexAuthContext";
import { SignUpButton } from "../shared/components/SignUpButton";
import { Row } from "../shared/components/layout/Row";
import { InputField } from "../shared/components/inputs/InputField";
import { HelpDanger, HelpLink } from "../shared/components/Help";
import { Icon } from "../shared/components/Icon";
import { InitResetPasswordModal } from "./elements/InitResetPasswordModal";
import { CenteredContent } from "../shared/components/layout/CenteredContent";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
  username: z.string({ required_error: "Username required" }).trim(),
  password: z.string({ required_error: "Password required" }).trim(),
});

export type SignInFormData = z.infer<typeof signInSchema>;

function useRedirectURI() {
  const query = new URLSearchParams(useLocation().search);
  return query.get("redirectURI");
}

export const SignInForm = () => {
  const { signIn } = useAuthentication();
  const { signInWithPlex } = usePlexAuth();
  const redirectURI = useRedirectURI();
  const [isInitPasswordModalOpen, setIsInitPasswordModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    mode: "onSubmit",
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // const cheddarrLogo = require("../assets/cheddarr.svg") as string;

  const onSubmit = handleSubmit((data) => {
    redirectURI ? signIn(data, redirectURI) : signIn(data);
  });

  function initSignInWithPlex() {
    redirectURI ? signInWithPlex(redirectURI) : signInWithPlex();
  }

  return (
    <div>
      <PrimaryHero>
        {
          <img
            id="cheddarrLogo"
            src={"../assets/cheddarr.svg"}
            alt="Chedarr"
            width="350px"
          />
        }
      </PrimaryHero>

      <br />

      <div className="columns is-mobile is-centered">
        <div className="column is-one-quarter-desktop is-half-tablet is-three-quarters-mobile">
          <form
            onSubmit={onSubmit}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
          >
            <InputField withIcon>
              <label>Username or email</label>
              <div className="with-left-icon">
                <input
                  type="text"
                  placeholder="Username or email"
                  {...register("username")}
                />
                <span className="icon">
                  <Icon icon={faUser} />
                </span>
              </div>
              {errors.username && errors.username.type === "required" && (
                <HelpDanger>
                  {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                </HelpDanger>
              )}
              {errors.username && errors.username.type === "minLength" && (
                <HelpDanger>
                  {FORM_DEFAULT_VALIDATOR.MIN_LENGTH.message}
                </HelpDanger>
              )}
              {errors.username && errors.username.type === "maxLength" && (
                <HelpDanger>
                  {FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}
                </HelpDanger>
              )}
            </InputField>

            <InputField withIcon>
              <label>Password</label>
              <div className="with-left-icon">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                />
                <span className="icon">
                  <Icon icon={faKey} />
                </span>
              </div>
              {errors.password && errors.password.type === "required" && (
                <HelpDanger>
                  {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                </HelpDanger>
              )}
              <HelpLink onClick={() => setIsInitPasswordModalOpen(true)}>
                Forgot your password ?
              </HelpLink>
            </InputField>

            <br />

            <SecondaryButton type="submit" width="100%">
              Sign in
            </SecondaryButton>
          </form>

          <PrimaryDivider />

          <CenteredContent>
            <PlexButton
              text="Sign in with Plex"
              onClick={() => initSignInWithPlex()}
            />
          </CenteredContent>

          <br />

          <Row justifyContent="space-around" alignItems="center">
            <p>Still not have an account ?</p>
            <SignUpButton />
          </Row>
        </div>
      </div>

      {isInitPasswordModalOpen && (
        <InitResetPasswordModal
          closeModal={() => setIsInitPasswordModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SignInForm;
