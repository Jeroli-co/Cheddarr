const FORM_DEFAULT_VALIDATOR = {
  REQUIRED: { value: null, message: "This is required" },
  MAX_LENGTH: { value: 128, message: "Must contain at least 128 characters" },
  PASSWORD_PATTERN: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,128}$/, message: "Password must contain at least 8 characters with at least one lowercase letter, one uppercase letter, one numeric digit, and one special character" }
};

export {
  FORM_DEFAULT_VALIDATOR
}