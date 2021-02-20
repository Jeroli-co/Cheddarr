export interface IEmailConfig {
  enabled: boolean;
  smtpPort: number;
  smtpHost: string;
  smtpUser: string;
  smtpPassword: string;
  senderAddress: string;
  senderName: string;
  ssl: boolean;
}
