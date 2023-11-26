import { MailService } from './../mail/mail.service';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { argon2id, hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { WorkersService } from 'src/workers/workers.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => WorkersService))
    private readonly workersService: WorkersService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: LoginDto) {
    const { email, password } = payload;
    const worker = await this.workersService.getByEmail(email);

    const isVerified = await this.verifyPassword(
      worker.hash_password,
      password,
    );

    if (!isVerified)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const jwtPayload = {
      sub: worker.id,
      first_name: worker.first_name,
      last_name: worker.first_name,
      role: worker.role,
    };

    return {
      acess_token: await this.jwtService.signAsync(jwtPayload),
    };
  }

  // async register(payload: RegisterDto) {
  //   const hashedPassword = await this.genHash(payload.password);

  //   await this.workersService.create({
  //     ...payload,
  //     hash_password: hashedPassword,
  //   });

  //   return {
  //     message: 'The user was created',
  //   };
  // }

  async changePassword(payload: ChangePasswordDto) {
    const { email, current_password, new_password, confirm_new_password } =
      payload;

    if (new_password !== confirm_new_password)
      throw new HttpException(
        'The new password and the confirmation of that password are not equals',
        HttpStatus.BAD_REQUEST,
      );

    const worker = await this.workersService.getByEmail(email);

    const isVerified = await this.verifyPassword(
      worker.hash_password,
      current_password,
    );

    if (!isVerified)
      throw new HttpException(
        'The current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );

    await this.workersService.changePassword(worker.id, new_password);

    return {
      message: 'The password was changed',
    };
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    const { email } = payload;
    const user = await this.workersService.getByEmail(email);

    const reset_token = randomBytes(32).toString('hex');

    await this.workersService.update(user.id, {
      reset_token,
    });

    this.mailService.sendForgotPasswordEmail(user.email, reset_token);

    return {
      message: 'The email was send',
    };
  }

  async resetPassword(payload: ResetPasswordDto) {
    const { email, new_password, reset_token } = payload;

    const worker = await this.workersService.getByEmail(email);

    if (reset_token !== worker.reset_token) {
      throw new HttpException(
        'The reset token is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.workersService.changePassword(worker.id, new_password);

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

  generateToken(): string {
    const payload = {};
    const expiresIn = '6h';

    const token = this.jwtService.sign(payload, { expiresIn });

    return token;
  }

  validateToken(token: string): boolean {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') return false;
      else throw error;
    }
  }
}
