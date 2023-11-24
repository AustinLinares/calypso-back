import {
  IsEmail,
  IsMobilePhone,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 20)
  name: string;

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
  password: string;

  @IsString()
  @IsMobilePhone('es-CL')
  phone: string;
}
