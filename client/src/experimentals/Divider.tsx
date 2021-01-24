import styled from "styled-components";

const Divider = styled.div`
  width: 100%;
  height: 0;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const PrimaryDivider = styled(Divider)`
  border-top: 1px solid ${(props) => props.theme.primary};
`;

export const SecondaryDivider = styled(Divider)`
  border-top: 1px solid ${(props) => props.theme.secondary};
`;
