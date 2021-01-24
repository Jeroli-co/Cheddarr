import React from "react";
import { UnprocessableEntity } from "./UnprocessableEntity";
import { InternalServerError } from "./InternalServerError";
import { UnhandledError } from "./UnhandledError";

type SwitchErrorsProps = {
  status: number;
};

export const SwitchErrors = ({ status }: SwitchErrorsProps) => {
  switch (status) {
    case 422:
      return <UnprocessableEntity />;
    case 500:
      return <InternalServerError />;
    default:
      return <UnhandledError />;
  }
};
