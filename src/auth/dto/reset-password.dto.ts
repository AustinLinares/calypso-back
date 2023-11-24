import { IsString, IsStrongPassword, IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  new_password: string;

  @IsString()
  reset_token: string;
}
