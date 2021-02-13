import React, { useState } from "react";
import styled, { css } from "styled-components";
import { STATIC_STYLES } from "../shared/enums/StaticStyles";
import { SidebarMenu } from "./sidebarMenu/SidebarMenu";
import { useWindowSize } from "../shared/hooks/useWindowSize";
import { NavbarMobile } from "./navbar/NavbarMobile";
import { Navbar } from "./navbar/Navbar";
import { SidebarMenuMobile } from "./sidebarMenu/SidebarMenuMobile";
import { SearchContextProvider } from "../shared/contexts/SearchContext";
import { Footer } from "../shared/components/Footer";
const SwitchRoutes = React.lazy(() => import("../router/SwitchRoutes"));

const Layout = styled.div`
  margin: 0;
  overflow-x: hidden;
`;

type PageLayoutProps = {
  isSidebarOpen: boolean;
};

const PageLayoutContainer = styled.div`
  padding: 20px;
  width: 100%;
  min-height: calc(
    100vh - ${STATIC_STYLES.NAVBAR_HEIGHT}px - ${STATIC_STYLES.FOOTER_HEIGHT}px
  );
  overflow-x: hidden;
  transition: ${STATIC_STYLES.SIDEBAR_TRANSITION_DURATION} ease;
`;

const PageLayout = styled(PageLayoutContainer)<PageLayoutProps>`
  margin-top: ${STATIC_STYLES.NAVBAR_HEIGHT}px;
  ${(props) =>
    props.isSidebarOpen &&
    css`
      margin-left: ${STATIC_STYLES.SIDEBAR_OPEN_WIDTH}px;
      max-width: calc(100% - ${STATIC_STYLES.SIDEBAR_OPEN_WIDTH}px);
    `}
  ${(props) =>
    !props.isSidebarOpen &&
    css`
      margin-left: ${STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px;
      max-width: calc(100% - ${STATIC_STYLES.SIDEBAR_CLOSED_WIDTH}px);
    `}
`;

const PageLayoutMobile = styled(PageLayoutContainer)<PageLayoutProps>`
  max-width: 100vw;
  ${(props) =>
    props.isSidebarOpen &&
    css`
      margin-left: 100vw;
      padding: 0;
    `};
  margin-top: ${STATIC_STYLES.NAVBAR_HEIGHT +
  STATIC_STYLES.SEARCH_BAR_HEIGHT}px;
`;

export const LoggedInApp = () => {
  const { width } = useWindowSize();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  if (width <= STATIC_STYLES.MOBILE_MAX_WIDTH) {
    return (
      <Layout>
        <SidebarMenuMobile isOpen={isOpen} toggle={toggle} />
        <NavbarMobile toggle={toggle} />
        <PageLayoutMobile isSidebarOpen={isOpen}>
          <SwitchRoutes />
        </PageLayoutMobile>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <SearchContextProvider>
          <SidebarMenu isOpen={isOpen} toggle={toggle} />
          <Navbar isSidebarOpen={isOpen} />{" "}
          <PageLayout isSidebarOpen={isOpen}>
            <SwitchRoutes />
          </PageLayout>
        </SearchContextProvider>
        <Footer />
      </Layout>
    );
  }
};
