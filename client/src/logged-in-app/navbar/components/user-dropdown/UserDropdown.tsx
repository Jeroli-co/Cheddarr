import { RefObject, useRef } from "react";
import { routes } from "../../../../router/routes";
import { faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useSession } from "../../../../shared/contexts/SessionContext";
import { STATIC_STYLES } from "../../../../shared/enums/StaticStyles";
import { useNavigate } from "react-router";
import { useOutsideAlerter } from "../../../../shared/hooks/useOutsideAlerter";
import { Icon } from "../../../../shared/components/Icon";

const Container = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: ${STATIC_STYLES.NAVBAR_HEIGHT + 5}px;
  right: 5px;
  display: ${(props) => (props.isVisible ? "block" : "none")};
  border: 1px solid ${(props) => props.theme.primaryLight};
  background: ${(props) => props.theme.primary};
  border-radius: 6px;
  z-index: 1;
  width: 150px;
`;

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 10px 0;
  margin: auto;
  border-radius: 6px;
  width: 100%;

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
  padding-right: 10px;
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

  const navigate = useNavigate();

  useOutsideAlerter([dropdownRef, avatarRef], () => hideDropdown());

  function logout() {
    invalidSession();
    navigate(routes.SIGN_IN.url());
  }

  return (
    <Container isVisible={isVisible} ref={dropdownRef}>
      <Item onClick={() => navigate(routes.PROFILE.url())}>
        <DropdownMenuItemIcon>
          <Icon icon={faUserCircle} />
        </DropdownMenuItemIcon>
        <span>Profile</span>
      </Item>
      <Item onClick={() => logout()}>
        <DropdownMenuItemIcon>
          <Icon icon={faSignOutAlt} />
        </DropdownMenuItemIcon>
        <span>Sign out</span>
      </Item>
    </Container>
  );
};

export {UserDropdown};
