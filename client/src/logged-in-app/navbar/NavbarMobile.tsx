import React, { useRef, useState } from "react";
import { useSession } from "../../shared/contexts/SessionContext";
import { useHistory } from "react-router";
import { UserDropdown } from "./components/user-dropdown/UserDropdown";
import styled, { css } from "styled-components";
import { STATIC_STYLES } from "../../shared/enums/StaticStyles";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../shared/components/Icon";
import { Row } from "../../shared/components/layout/Row";
import { NavbarContainer, NavbarUserAvatar } from "./NavbarCommon";
import { SearchBar } from "./components/search-bar/SearchBar";

const cheddarrLogo = require("../../assets/cheddarr.svg");

const Item = styled.div<{ width?: string }>`
  width: ${STATIC_STYLES.NAVBAR_HEIGHT}px;
  height: ${STATIC_STYLES.NAVBAR_HEIGHT}px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;

  ${(props) =>
    props.width &&
    css`
      width: ${props.width};
    `}
`;

export type NavbarMobileProps = {
  toggle: () => void;
};

export const NavbarMobile = ({ toggle }: NavbarMobileProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const avatarRef = useRef<HTMLImageElement>(null);

  const {
    session: { avatar },
  } = useSession();
  const history = useHistory();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <NavbarContainer className="noselect">
      <Row justifyContent="space-between" alignItems="center">
        <Item onClick={() => toggle()}>
          <Icon icon={faBars} />
        </Item>
        <Item width="120px">
          <img
            src={cheddarrLogo}
            alt="Cheddarr"
            onClick={() => history.push("/")}
          />
        </Item>
        <Item>
          <NavbarUserAvatar
            src={avatar}
            alt="User"
            onClick={() => toggleDropdown()}
            ref={avatarRef}
          />
        </Item>
      </Row>
      <SearchBar />
      <UserDropdown
        isVisible={isDropdownOpen}
        hideDropdown={() => setIsDropdownOpen(false)}
        avatarRef={avatarRef}
      />
    </NavbarContainer>
  );
};
