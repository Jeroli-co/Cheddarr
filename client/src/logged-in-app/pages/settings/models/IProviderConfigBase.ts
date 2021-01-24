export interface IProviderConfigBase {
  readonly host: string;
  port: number | string | null;
  readonly ssl: boolean;
  readonly apiKey: string;
}
