const ERRORS_MESSAGE = {
  NONE: "Everything is fine",
  STATUS_410_GONE: "This link has expired or is invalid",
  STATUS_409_CONFLICT: "This resource already exist",
  USER_ALREADY_CONFIRMED: "User already confirmed",
  UNEXPECTED_ERROR: "An unexpected error occurred",
  UNHANDLED_STATUS: (code) => "Unhandled status code " + code,
};

export { ERRORS_MESSAGE };
