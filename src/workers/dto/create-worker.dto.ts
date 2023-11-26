import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { Role } from 'src/role/enums/role.enum';
import { IsNumberArray } from 'src/utils/customValidators/IsNumberArray';

export class CreateWorkerDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

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

  @IsEnum(Role, {
    message: 'Role must be one of: worker, manager, admin',
  })
  role: Role;

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
