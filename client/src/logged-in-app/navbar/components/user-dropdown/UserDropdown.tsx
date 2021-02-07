import React, { useRef } from "react";
import { RefObject } from "react";
import { routes } from "../../../../router/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useSession } from "../../../../shared/contexts/SessionContext";
import { STATIC_STYLES } from "../../../../shared/enums/StaticStyles";
import { useHistory } from "react-router";
import { useOutsideAlerter } from "../../../../shared/hooks/useOutsideAlerter";

const Container = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: ${STATIC_STYLES.NAVBAR_HEIGHT + 5}px;
  right: 5px;
  display: ${(props) => (props.isVisible ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  border: 1px solid ${(props) => props.theme.primaryLight};
  background: ${(props) => props.theme.primary};
  border-radius: 6px;
  z-index: 1;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 25px;
  width: 100%;
  border-radius: 6px;

  &:first-child {
    border-radius: 6px 6px 0 0;
    border-bottom: 1px solid ${(props) => props.theme.primaryLight};
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }

  &:hover {
    background: ${(props) => props.theme.secondary};
  }
`;

const DropdownMenuItemIcon = styled.div`
  margin-right: 1em;
`;

type UserDropdownProps = {
  isVisible: boolean;
  hideDropdown: () => void;
  avatarRef: RefObject<HTMLImageElement>;
};

const UserDropdown = ({
  isVisible,
  hideDropdown,
  avatarRef,
}: UserDropdownProps) => {
  const { invalidSession } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const history = useHistory();

  useOutsideAlerter([dropdownRef, avatarRef], () => hideDropdown());

  function logout() {
    invalidSession();
    history.push(routes.SIGN_IN.url());
  }

  return (
    <Container isVisible={isVisible} ref={dropdownRef}>
      <Item onClick={() => history.push(routes.USER_PROFILE.url)}>
        <DropdownMenuItemIcon>
          <FontAwesomeIcon icon={faUserCircle} />
        </DropdownMenuItemIcon>
        <span>Profile</span>
      </Item>
      <Item onClick={() => logout()}>
        <DropdownMenuItemIcon>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </DropdownMenuItemIcon>
        <span>Sign out</span>
      </Item>
    </Container>
  );
};

export { UserDropdown };
