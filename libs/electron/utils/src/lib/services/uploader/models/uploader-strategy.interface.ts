export interface IUploaderConfig {
  url: string | null;
  tenantId: string | null;
  token: string | null;
  organizationId: string | null;
  refreshToken?: string;
}

export interface IUploaderStrategy {
  config(): Promise<IUploaderConfig | null> | IUploaderConfig | null;
}
