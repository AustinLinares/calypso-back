import { IsEmail, IsString } from 'class-validator';

export class UserAppointmentsDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  token: string;
}
