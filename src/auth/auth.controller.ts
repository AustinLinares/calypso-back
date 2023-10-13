import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/Guard';

@Controller('auth')
export class AuthController {
  // api/auth/google/login
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handlerLogin() {
    return { msg: 'Google Authentication' };
  }
  // api/auth/google/redirect
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handlerRedirect() {
    return { msg: 'OK' };
  }
}
