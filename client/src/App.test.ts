import React from "react";
import { render } from "@testing-library/react";
import { App } from "./App";

test("Component className is App", () => {
  const app = React.createElement(App);
  const tree: any = render(app);
  expect(tree.container.firstChild).toHaveClass("App");
});
