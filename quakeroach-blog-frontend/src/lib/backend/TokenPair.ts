export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  timeUntilRefreshTokenExpiration: moment.Duration;
}