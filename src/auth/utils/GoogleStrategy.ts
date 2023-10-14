import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigType } from '@nestjs/config';
import config from '../../config';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {
    super({
      clientID: configService.GOOGLE_CLIENT_ID,
      clientSecret: configService.GOOGLE_CLIENT_SECRET,
      callbackURL: configService.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken, refreshToken, profile);
    const user = this.authService.validateUser({
      email: profile.emails[0].value,
      displayName: profile.displayName,
    });
    console.log('Validate');
    console.log(user);
    return user || null;
  }
}
