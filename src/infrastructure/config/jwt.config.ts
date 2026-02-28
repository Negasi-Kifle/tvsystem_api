export const jwtConfig = {
  accessTokenTtl: '1d',
  refreshTokenTtl: '7d',
  secret: process.env.JWT_SECRET || 'changeme',
};
