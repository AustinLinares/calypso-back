import { IsEmail, IsMobilePhone, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(0, 20)
  name: string;

  @IsString()
  @IsMobilePhone('es-CL')
  phone: string;

  @IsString()
  @IsEmail()
  email: string;
}