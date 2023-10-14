import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/Guard';
import { Request } from 'express';

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

  @Get('status')
  user(@Req() request: Request) {
    console.log(request.user);
    if (request.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }
}
