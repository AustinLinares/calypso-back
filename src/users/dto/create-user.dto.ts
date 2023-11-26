import { IsEmail, IsMobilePhone, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  first_name: string;

  @IsString()
  @Length(3, 20)
  last_name: string;

  @IsString()
  @IsMobilePhone('es-CL')
  phone: string;

  @IsString()
  @IsEmail()
  email: string;

  // @IsString()
  // hash_password: string;
}
