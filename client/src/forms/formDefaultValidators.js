const FORM_DEFAULT_VALIDATOR = {
  REQUIRED: { value: null, message: "This is required" },
  MIN_LENGTH: { value: 4, message: "Must contain at least 4 character" },
  MAX_LENGTH: { value: 128, message: "Must contain a maximum of 128 characters" },
  PASSWORD_PATTERN: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,128}$/, message: "Password must contain at least 8 characters with at least one lowercase letter, one uppercase letter, one numeric digit, and one special character" },
  EMAIL_PATTERN: { value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i, message: "This in not a valid email" },
  WATCH_PASSWORD: { value: null, message: "Password are not equals" },
  USERNAME_PATTERN: { value: /^[a-zA-Z0-9]+$/, message: "Special character are not allowed" }
};

export {
  FORM_DEFAULT_VALIDATOR
}