import { IsEmail, IsString } from 'class-validator';

export class NewTokenDto {
  @IsString()
  @IsEmail()
  email: string;
}
