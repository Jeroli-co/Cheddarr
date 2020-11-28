import React, { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { ThemeDynamicContext } from "../../../themes/ThemeDynamicContextProvider";
import { IPalette, themes } from "../../../themes/Themes";
import { Text } from "../../../../utils/elements/Text";
import { useOutsideAlerter } from "../../../../utils/hooks/useOutsideAlerter";
import { ToggleSwitch } from "../../../../utils/elements/ToggleSwitch";

const ThemesPickerStyle = styled.div`
  position: relative;
`;

type ThemePreviewStyleProps = {
  themeOverride?: IPalette;
};

const ThemePreviewStyle = styled.div<ThemePreviewStyleProps>`
  width: 25px;
  height: 25px;
  border: 1px solid ${(props) => props.theme.color};
  border-radius: 6px;
  background: ${(props) =>
    props.themeOverride ? props.themeOverride.primary : props.theme.primary};
  background: -moz-linear-gradient(135deg, ${(props) =>
    props.themeOverride
      ? props.themeOverride.primary
      : props.theme.primary} 50%, ${(props) =>
  props.themeOverride
    ? props.themeOverride.secondary
    : props.theme.secondary} 50%);
  background: -webkit-linear-gradient(135deg, ${(props) =>
    props.themeOverride
      ? props.themeOverride.primary
      : props.theme.primary} 50%, ${(props) =>
  props.themeOverride
    ? props.themeOverride.secondary
    : props.theme.secondary} 50%);
  background: linear-gradient(135deg, ${(props) =>
    props.themeOverride
      ? props.themeOverride.primary
      : props.theme.primary} 50%, ${(props) =>
  props.themeOverride
    ? props.themeOverride.secondary
    : props.theme.secondary} 50%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="${(props) =>
    props.themeOverride
      ? props.themeOverride.primary
      : props.theme.primary}",endColorstr="${(props) =>
  props.themeOverride
    ? props.themeOverride.secondary
    : props.theme.secondary}",GradientType=1);
`;

const ThemesDropdownStyle = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 35px;
  display: ${(props) => (props.isVisible ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => props.theme.dark};
  box-shadow: 1px 1px 8px 1px ${(props) => props.theme.dark};
  border-radius: 6px;
  background: ${(props) => props.theme.bgColor};
  z-index: 10;
  padding: 2%;

  > *:not(:last-child) {
    border-bottom: 1px solid LightGrey;
  }
`;

const ThemeDropdownOptionStyle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 5px;
`;

const ThemeLightDarkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
`;

const ThemeDropdownOptionText = ({ children }: any) => {
  return (
    <Text whiteSpace="nowrap" paddingLeft="5px">
      {children}
    </Text>
  );
};

type ThemesDropdownProps = {
  show: boolean;
};

const ThemesDropdown = ({ show }: ThemesDropdownProps) => {
  const { darkMode, toggleDarkMode, switchTheme } = useContext(
    ThemeDynamicContext
  );

  return (
    <ThemesDropdownStyle isVisible={show}>
      <ThemeLightDarkContainer>
        <Text paddingRight="10px">Light</Text>
        <ToggleSwitch
          checked={darkMode}
          round
          toggle={() => toggleDarkMode()}
        />
        <Text paddingLeft="10px">Dark</Text>
      </ThemeLightDarkContainer>

      <ThemeDropdownOptionStyle onClick={() => switchTheme(themes.orange)}>
        <ThemePreviewStyle
          themeOverride={darkMode ? themes.orange.dark : themes.orange.light}
        />
        <ThemeDropdownOptionText>Orange/Yellow</ThemeDropdownOptionText>
      </ThemeDropdownOptionStyle>

      <ThemeDropdownOptionStyle onClick={() => switchTheme(themes.blue)}>
        <ThemePreviewStyle
          themeOverride={darkMode ? themes.blue.dark : themes.blue.light}
        />
        <ThemeDropdownOptionText>Blue/Purple</ThemeDropdownOptionText>
      </ThemeDropdownOptionStyle>
    </ThemesDropdownStyle>
  );
};

export const ThemesPicker = () => {
  const [showThemesDropdown, setShowThemeDropdown] = useState(false);
  const toggleThemePicker = () => setShowThemeDropdown(!showThemesDropdown);
  const themesPickerRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter([themesPickerRef], () => setShowThemeDropdown(false));

  return (
    <ThemesPickerStyle
      onClick={() => toggleThemePicker()}
      ref={themesPickerRef}
    >
      <ThemePreviewStyle />
      <ThemesDropdown show={showThemesDropdown} />
    </ThemesPickerStyle>
  );
};
