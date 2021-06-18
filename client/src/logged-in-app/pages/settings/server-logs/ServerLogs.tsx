import React from "react";
import { useRoleGuard } from "../../../../shared/hooks/useRoleGuard";
import { Roles } from "../../../../shared/enums/Roles";
import { usePagination } from "../../../../shared/hooks/usePagination";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";
import { ILog } from "../../../../shared/models/ILog";
import { Spinner } from "../../../../shared/components/Spinner";
import { SwitchErrors } from "../../../../shared/components/errors/SwitchErrors";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  margin: 5px 0;
  border: 1px solid ${(props) => props.theme.white};
  cursor: pointer;
`;

const Item = styled.div<{ grow?: number }>`
  flex: ${(props) => (props.grow ? props.grow : 1)} 1 0;

  &:nth-child(2) {
    text-align: center;
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

export const ServerLogs = () => {
  useRoleGuard([Roles.ADMIN]);

  const logs = usePagination<ILog>(APIRoutes.LOGS, false);

  if (logs.data.isLoading) {
    return <Spinner />;
  }

  if (logs.data.data === null) {
    return <SwitchErrors status={logs.data.status} />;
  }

  return (
    <Container>
      {logs.data.data &&
        logs.data.data.results &&
        logs.data.data.results.map((log) => (
          <Line key={log.time}>
            <Item grow={2}>{log.time}</Item>
            <Item>{log.level}</Item>
            <Item grow={3}>{log.process}</Item>
          </Line>
        ))}
    </Container>
  );
};
