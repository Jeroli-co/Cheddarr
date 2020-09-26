import React from "react";
import { Spinner } from "../../../utils/elements/Spinner";
import { withTheme } from "styled-components";

const RequestsSpinner = (props) => {
  return <Spinner color={props.theme.primary} size="2x" />;
};

export default withTheme(RequestsSpinner);
