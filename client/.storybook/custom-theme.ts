import { create } from "@storybook/theming/create";

export default create({
  base: "light",

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: "monospace",

  brandTitle: "Cheddarr Storybook",
  brandUrl: "https://cheddarr.com",
  brandImage: "/assets/cheddarr.png",
  brandTarget: "_self",

  // Colors
  colorPrimary: "hsl(244, 32%, 50%)",
  colorSecondary: "hsl(25, 100%, 50%)",

  // UI
  appBg: "hsl(244, 32%, 5%)",
  appContentBg: "hsl(244, 32%, 25%)",
  appBorderColor: "hsl(244, 32%, 50%)",
  appBorderRadius: 4,

  // Text colors
  textColor: "hsl(244, 32%, 50%)",
  textInverseColor: "hsl(244, 32%, 5%)",

  // Toolbar default and active colors
  barTextColor: "hsl(244, 32%, 50%)",
  barSelectedColor: "hsl(244, 32%, 25%)",
  barBg: "hsl(244, 32%, 5%)",

  // Form colors
  inputBg: "hsl(244, 32%, 50%)",
  inputBorder: "hsl(244, 32%, 5%)",
  inputTextColor: "hsl(244, 32%, 5%)",
  inputBorderRadius: 2,
});
