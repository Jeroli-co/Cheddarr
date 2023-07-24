import * as React from "react";
import styled, { css } from "styled-components";
import { STATIC_STYLES } from "../shared/enums/StaticStyles";
import { SidebarMenu } from "../logged-in-app/sidebarMenu/SidebarMenu";
import { useWindowSize } from "../shared/hooks/useWindowSize";
import { NavbarMobile } from "../logged-in-app/navbar/NavbarMobile";
import { Navbar } from "../logged-in-app/navbar/Navbar";
import { SidebarMenuMobile } from "../logged-in-app/sidebarMenu/SidebarMenuMobile";
import { Footer } from "../shared/components/Footer";
import { useState } from "react";
import { PageLoader } from "../shared/components/PageLoader";

const Layout = styled.div`
  margin: 0;
  overflow-x: hidden;
`;

type PageLayoutProps = {
  isSidebarOpen: boolean;
};

const PageLayoutContainer = styled.div`
  padding: 20px;
  min-height: calc(
    100vh - ${STATIC_STYLES.NAVBAR_HEIGHT + STATIC_STYLES.FOOTER_HEIGHT}px
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

const Router = React.lazy(() => import("./router"));

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { width } = useWindowSize();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <React.Suspense fallback={<PageLoader />}>
      {width <= STATIC_STYLES.TABLET_MAX_WIDTH ? (
        <Layout>
          <SidebarMenuMobile isOpen={isOpen} toggle={toggle} />
          <NavbarMobile toggle={toggle} />
          <PageLayoutMobile isSidebarOpen={isOpen}>
            <Router />
          </PageLayoutMobile>
          <Footer />
        </Layout>
      ) : (
        <Layout>
          <SidebarMenu isOpen={isOpen} toggle={toggle} />
          <Navbar isSidebarOpen={isOpen} />{" "}
          <PageLayout isSidebarOpen={isOpen}>
            <Router />
          </PageLayout>
          <Footer />
        </Layout>
      )}
    </React.Suspense>
  );
};
