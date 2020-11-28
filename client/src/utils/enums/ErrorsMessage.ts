const ERRORS_MESSAGE = {
  NONE: "Everything is fine",
  STATUS_401_UNAUTHORIZED: "This link has expired or is invalid",
  STATUS_410_GONE: "This link has expired or is invalid",
  STATUS_409_CONFLICT: "This resource already exist",
  STATUS_422_UNPROCESSABLE: "This resource is unprocessable",
  STATUS_403_FORBIDDEN: "Forbidden",
  STATUS_400_BAD_REQUEST: "Bad request",
  USER_ALREADY_CONFIRMED: "User already confirmed",
  INTERNAL_SERVER_ERROR: "Internal server error",
  UNEXPECTED_ERROR: "An unexpected error occurred",
  UNHANDLED_STATUS: (code: number) => "Unhandled status code " + code,
};

export { ERRORS_MESSAGE };
