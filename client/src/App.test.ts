import * as React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("Component className is App", () => {
  const app = React.createElement(App);
  const {
    container: { firstChild },
  } = render(app);

  expect(firstChild).toHaveClass("App");
});
