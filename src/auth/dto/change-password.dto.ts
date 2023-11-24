import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  current_password: string;

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
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  confirm_new_password: string;
}
