export const jwtConfig = {
  accessTokenTtl: '15m',
  refreshTokenTtl: '7d',
  secret: process.env.JWT_SECRET || 'changeme',
};
