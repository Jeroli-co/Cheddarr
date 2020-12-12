export interface IProviderConfigBase {
  readonly host: string;
  readonly port: number | null;
  readonly ssl: boolean;
  readonly apiKey: string;
}
