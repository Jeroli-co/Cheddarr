import React, { useState } from "react";
import { useRoleGuard } from "../../../../shared/hooks/useRoleGuard";
import { Roles } from "../../../../shared/enums/Roles";
import { usePagination } from "../../../../shared/hooks/usePagination";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";
import { ILog } from "../../../../shared/models/ILog";
import { Spinner } from "../../../../shared/components/Spinner";
import { SwitchErrors } from "../../../../shared/components/errors/SwitchErrors";
import styled from "styled-components";
import { LogLevels } from "../../../../shared/enums/LogLevels";
import { PaginationArrows } from "../../../../shared/components/PaginationArrows";

const Container = styled.div`
  padding: 20px;
`;

const LogContainer = styled.div`
  margin: 10px 0;
`;

const LogMessageContainer = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.white};
  border-left: 1px solid ${(props) => props.theme.white};
  border-right: 1px solid ${(props) => props.theme.white};
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  padding: 10px;
`;

const Line = styled.div<{ level: LogLevels; isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.white};
  cursor: pointer;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: ${(props) => (props.isOpen ? 0 : "2px")};
  border-bottom-right-radius: ${(props) => (props.isOpen ? 0 : "2px")};
  background: ${(props) => {
    switch (props.level) {
      case LogLevels.ERROR:
        return props.theme.danger;
      case LogLevels.WARNING:
        return props.theme.warning;
      default:
        return props.theme.primaryLight;
    }
  }};
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

type LogComponentProps = {
  log: ILog;
};

const LogComponent = ({ log }: LogComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <LogContainer>
      <Line
        isOpen={isOpen}
        level={log.level}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Item grow={2}>{log.time}</Item>
        <Item>{log.level}</Item>
        <Item grow={3}>{log.process}</Item>
      </Line>
      {isOpen && <LogMessageContainer>{log.message}</LogMessageContainer>}
    </LogContainer>
  );
};

export const ServerLogs = () => {
  useRoleGuard([Roles.ADMIN]);

  const { data: logs, loadNext, loadPrev, loadPage } = usePagination<ILog>(
    APIRoutes.LOGS,
    false
  );

  if (logs.isLoading) {
    return <Spinner />;
  }

  if (logs.data === null) {
    return <SwitchErrors status={logs.status} />;
  }

  return (
    <Container>
      {logs.data &&
        logs.data.results &&
        logs.data.results.map((log, index) => (
          <LogComponent log={log} key={index} />
        ))}
      <PaginationArrows
        currentPage={logs.data?.page}
        totalPages={logs.data?.totalPages}
        onLoadPrev={() => loadPrev()}
        onLoadNext={() => loadNext()}
        onLoadPage={loadPage}
      />
    </Container>
  );
};
