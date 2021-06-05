import { LogLevels } from "../enums/LogLevels";

export interface IConfig {
  logLevel: LogLevels;
  defaultRoles: number;
}
