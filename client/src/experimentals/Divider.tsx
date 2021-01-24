import styled from "styled-components";

export const Divider = styled.div`
  width: 100%;
  height: 0;
  margin-top: 20px;
  margin-bottom: 20px;
  border-top: 1px solid ${(props) => props.theme.color};
`;

export const PrimaryDivider = styled(Divider)`
  border-top: 1px solid ${(props) => props.theme.primary};
`;

export const SecondaryDivider = styled(Divider)`
  border-top: 1px solid ${(props) => props.theme.secondary};
`;

export const VerticalDivider = styled.div`
  width: 0;
  height: 100%;
  margin-left: 20px;
  margin-right: 20px;
  border-left: 1px solid ${(props) => props.theme.color};
`;

export const PrimaryVerticalDivider = styled(VerticalDivider)`
  border-left: 1px solid ${(props) => props.theme.primary};
`;

export const SecondaryVerticalDivider = styled(VerticalDivider)`
  border-left: 1px solid ${(props) => props.theme.secondary};
`;
