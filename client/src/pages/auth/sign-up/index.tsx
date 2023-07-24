import { faKey, faSignInAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { FORM_DEFAULT_VALIDATOR } from "../../../shared/enums/FormDefaultValidators";
import { useAuthentication } from "../../../shared/contexts/AuthenticationContext";
import { PrimaryDivider } from "../../../shared/components/Divider";
import { usePlexAuth } from "../../../shared/contexts/PlexAuthContext";
import { Input } from "../../../shared/components/forms/inputs/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "../layout";
import { routes } from "../../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import { Title } from "../../../elements/Title";
import { Button } from "../../../elements/Button";

const signUpSchema = z
  .object({
    username: z
      .string({ required_error: "Username required" })
      .trim()
      .min(FORM_DEFAULT_VALIDATOR.MIN_LENGTH.value, {
        message: FORM_DEFAULT_VALIDATOR.MIN_LENGTH.message,
      })
      .max(FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value, {
        message: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message,
      })
      .regex(FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.value, {
        message: FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.message,
      }),
    password: z
      .string({ required_error: "Password required" })
      .trim()
      .regex(FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value, {
        message: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message,
      }),
    passwordConfirmation: z
      .string({ required_error: "Confirmation required" })
      .trim(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    mode: "onSubmit",
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      passwordConfirmation: "",
    },
  });
  const { signUp } = useAuthentication();
  const { signInWithPlex } = usePlexAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    signUp(data);
  });

  return (
    <Layout>
      <img src="/assets/cheddarr.svg" alt="logo" className="mb-14" />

      <Title as="h1" variant="center">
        Create your account
      </Title>

      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        <div className="space-y-3">
          <Input
            icon={faUser}
            label="Username"
            type="text"
            placeholder="Username"
            error={errors.username?.message}
            {...register("username")}
          />

          <Input
            icon={faKey}
            label="Password"
            type="password"
            placeholder="Strong password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            icon={faKey}
            label="Confirm password"
            type="password"
            placeholder="Confirm password"
            error={errors.passwordConfirmation?.message}
            {...register("passwordConfirmation")}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p>Already have an account ?</p>
            <Button
              color="secondary"
              onClick={() => navigate(routes.SIGN_IN.url(), { replace: true })}
            >
              <FontAwesomeIcon icon={faSignInAlt} />
              <span>Sign in</span>
            </Button>
          </div>

          <Button type="submit">Sign up</Button>
        </div>

        <PrimaryDivider />

        <Title as="h2" variant="center">
          Authentication provider
        </Title>

        <Button
          color="plex"
          className="place-self-center"
          onClick={() => signInWithPlex()}
        >
          <img className="w-6 h-auto" src="/assets/plex.png" alt="Plex logo" />
          Sign up with plex
        </Button>
      </form>
    </Layout>
  );
};
