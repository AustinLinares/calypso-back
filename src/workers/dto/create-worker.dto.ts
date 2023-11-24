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
    message: 'Only valid a array of numbers on services_ids',
  })
  services_ids: number[];

  @Validate(IsNumberArray, {
    message: 'Only valid a array of numbers on rooms_schedules_ids',
  })
  rooms_schedules_ids: number[];
}
