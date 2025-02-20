import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: 'dalyMagherby&Dat',
  signOptions: { expiresIn: '1h' },
};