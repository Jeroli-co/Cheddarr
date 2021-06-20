export interface IProviderSettingsBase {
  host: string;
  port: number | string | null;
  ssl: boolean;
  apiKey: string;
  version: number;
}
