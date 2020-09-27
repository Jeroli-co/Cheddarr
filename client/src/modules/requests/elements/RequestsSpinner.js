import React from "react";
import { withTheme } from "styled-components";
import Spinner from "../../../utils/elements/Spinner";

const RequestsSpinner = (props) => {
  return <Spinner color={props.theme.primary} size="2x" />;
};

export default withTheme(RequestsSpinner);
