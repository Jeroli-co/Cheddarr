import React from "react";
import { UnprocessableEntity } from "./UnprocessableEntity";
import { InternalServerError } from "./InternalServerError";
import { UnhandledError } from "./UnhandledError";
import { useSession } from "../../contexts/SessionContext";

type SwitchErrorsProps = {
  status: number;
};

export const SwitchErrors = ({ status }: SwitchErrorsProps) => {
  const { invalidSession } = useSession();
  switch (status) {
    case 401:
      invalidSession();
      return <div />;
    case 422:
      return <UnprocessableEntity />;
    case 500:
      return <InternalServerError />;
    default:
      return <UnhandledError />;
  }
};
