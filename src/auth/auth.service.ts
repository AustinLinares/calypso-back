import { MailService } from './../mail/mail.service';
import { UsersService } from './../users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { argon2id, hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/role/enums/role.enum';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: LoginDto) {
    const { email, password } = payload;
    const user = await this.usersService.getByEmail(email);

    const isVerified = await this.verifyPassword(user.hash_password, password);

    if (!isVerified)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const jwtPayload = {
      sub: user.id,
      username: user.name,
      role: Role.USER,
    };

    return {
      acess_token: await this.jwtService.signAsync(jwtPayload),
    };
  }

  async register(payload: RegisterDto) {
    const hashedPassword = await this.genHash(payload.password);

    await this.usersService.create({
      ...payload,
      hash_password: hashedPassword,
    });

    return {
      message: 'The user was created',
    };
  }

  async changePassword(payload: ChangePasswordDto) {
    const { email, current_password, new_password, confirm_new_password } =
      payload;

    if (new_password !== confirm_new_password)
      throw new HttpException(
        'The new password and the confirmation of that password are not equals',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.usersService.getByEmail(email);

    const isVerified = await this.verifyPassword(
      user.hash_password,
      current_password,
    );

    if (!isVerified)
      throw new HttpException(
        'The current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );

    const hash_password = await this.genHash(new_password);

    await this.usersService.update(user.id, { hash_password });

    return {
      message: 'The password was changed',
    };
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    const { email } = payload;
    const user = await this.usersService.getByEmail(email);

    const reset_token = randomBytes(32).toString('hex');

    await this.usersService.update(user.id, {
      reset_token,
    });

    this.mailService.sendForgotPasswordEmail(user.email, reset_token);

    return {
      message: 'The email was send',
    };
  }

  async resetPassword(payload: ResetPasswordDto) {
    const { email, new_password, reset_token } = payload;

    const user = await this.usersService.getByEmail(email);

    if (reset_token !== user.reset_token) {
      throw new HttpException(
        'The reset token is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hash_password = await this.genHash(new_password);

    await this.usersService.update(user.id, {
      hash_password,
      reset_token: null,
    });

    return {
      message: 'The password was reseted',
    };
  }

  genHash(password: string) {
    return hash(password, {
      type: argon2id,
      // memoryCost: 1 << 22,
      memoryCost: 1 << 20,
      timeCost: 2,
      parallelism: 1,
    });
  }

  verifyPassword(hash_password: string, password: string) {
    return verify(hash_password, password);
  }
}
