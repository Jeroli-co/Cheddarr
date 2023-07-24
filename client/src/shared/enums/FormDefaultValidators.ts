const USERNAME_MIN_LENGTH = 4;
const USERNAME_MAX_LENGTH = 128;
const FORM_DEFAULT_VALIDATOR = {
  REQUIRED: { value: null, message: "This is required" },
  MIN_LENGTH: {
    value: USERNAME_MIN_LENGTH,
    message: `Must contain at least ${USERNAME_MIN_LENGTH} characters`,
  },
  MAX_LENGTH: {
    value: USERNAME_MAX_LENGTH,
    message: `Must contain a maximum of ${USERNAME_MAX_LENGTH} characters`,
  },
  PASSWORD_PATTERN: {
    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,128}$/,
    message:
      "Password must contain at least 8 characters with at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
  },
  EMAIL_PATTERN: {
    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i,
    message: "This in not a valid email",
  },
  WATCH_PASSWORD: { value: null, message: "Password are not equals" },
  USERNAME_PATTERN: {
    value: /^[a-zA-Z0-9]+$/,
    message: "Special character are not allowed",
  },
};

export { FORM_DEFAULT_VALIDATOR };
