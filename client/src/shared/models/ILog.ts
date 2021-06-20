import { LogLevels } from "../enums/LogLevels";

export interface ILog {
  time: string;
  level: LogLevels;
  process: string;
  message: string;
}
