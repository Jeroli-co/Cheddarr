export interface IJob {
  id: string;
  name: string;
  nextRunTime?: Date;
}

export enum JobActionsEnum {
  RUN = "run",
  PAUSE = "pause",
  RESUME = "resume",
}
