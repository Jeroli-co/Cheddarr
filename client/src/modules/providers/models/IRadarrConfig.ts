export interface IRadarrConfig {
  readonly enabled: boolean;
  readonly apiKey: string;
  readonly host: string;
  readonly port: number;
  readonly ssl: boolean;
  readonly version: string;
  readonly rootFolder: string;
  readonly qualityProfileId: number;
}
