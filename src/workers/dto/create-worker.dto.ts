import {
  IsArray,
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsNumberArray } from 'src/utils/customValidators/IsNumberArray';

export class CreateWorkerDto {
  @IsString()
  name: string;

  @IsString()
  @IsMobilePhone('es-CL')
  phone: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  speciality: string;

  @IsString()
  @IsOptional()
  presentation?: string;

  @IsString()
  position: string;

  @IsArray()
  @Validate(IsNumberArray, {
    message: 'Only valid a array of numbers on services_id',
  })
  services_ids: number[];
}
