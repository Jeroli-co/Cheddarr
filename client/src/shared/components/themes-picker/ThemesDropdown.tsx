import React, { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { ThemeDynamicContext } from "../../contexts/themes/ThemeDynamicContextProvider";
import { Text } from "../Text";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";
import { ToggleSwitch } from "../ToggleSwitch";
import { STATIC_STYLES } from "../../enums/StaticStyles";
import {
  BLUE_PALETTE,
  GREEN_PALETTE,
  IPalette,
  ORANGE_PALETTE,
} from "../../contexts/themes/Palettes";

const ThemesPickerStyle = styled.div`
  position: relative;
`;

type ThemePreviewStyleProps = {
  palette?: IPalette;
};

const ThemePreviewStyle = styled.div<ThemePreviewStyleProps>`
  width: 25px;
  height: 25px;
  border: 1px solid ${STATIC_STYLES.COLORS.DARK};
  border-radius: 6px;
  background: ${(props) =>
    props.palette ? props.palette.primary : props.theme.primary};
  background: -moz-linear-gradient(135deg, ${(props) =>
    props.palette ? props.palette.primary : props.theme.primary} 50%, ${(
  props
) => (props.palette ? props.palette.secondary : props.theme.secondary)} 50%);
  background: -webkit-linear-gradient(135deg, ${(props) =>
    props.palette ? props.palette.primary : props.theme.primary} 50%, ${(
  props
) => (props.palette ? props.palette.secondary : props.theme.secondary)} 50%);
  background: linear-gradient(135deg, ${(props) =>
    props.palette ? props.palette.primary : props.theme.primary} 50%, ${(
  props
) => (props.palette ? props.palette.secondary : props.theme.secondary)} 50%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="${(props) =>
    props.palette
      ? props.palette.primary
      : props.theme.primary}",endColorstr="${(props) =>
  props.palette
    ? props.palette.secondary
    : props.theme.secondary}",GradientType=1);
`;

const ThemesDropdownStyle = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 35px;
  display: ${(props) => (props.isVisible ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid ${STATIC_STYLES.COLORS.GRAY};
  border-radius: 6px;
  z-index: 10;
  padding: 2%;
  background-color: ${(props) => props.theme.bgColor};

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
  const { darkMode, toggleDarkMode, switchPalette } = useContext(
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

      <ThemeDropdownOptionStyle onClick={() => switchPalette(ORANGE_PALETTE)}>
        <ThemePreviewStyle palette={ORANGE_PALETTE} />
        <ThemeDropdownOptionText>Orange</ThemeDropdownOptionText>
      </ThemeDropdownOptionStyle>

      <ThemeDropdownOptionStyle onClick={() => switchPalette(BLUE_PALETTE)}>
        <ThemePreviewStyle palette={BLUE_PALETTE} />
        <ThemeDropdownOptionText>Blue</ThemeDropdownOptionText>
      </ThemeDropdownOptionStyle>

      <ThemeDropdownOptionStyle onClick={() => switchPalette(GREEN_PALETTE)}>
        <ThemePreviewStyle palette={GREEN_PALETTE} />
        <ThemeDropdownOptionText>Green</ThemeDropdownOptionText>
      </ThemeDropdownOptionStyle>
    </ThemesDropdownStyle>
  );
};

export const ThemesPicker = (props: any) => {
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
