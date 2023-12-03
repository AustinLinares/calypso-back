import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkerDto } from './create-worker.dto';
import { IsArray, IsBoolean, IsOptional, Validate } from 'class-validator';
import { IsNumberArray } from 'src/utils/customValidators/IsNumberArray';

export class UpdateWorkerDto extends PartialType(CreateWorkerDto) {
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;

  services_id?: never;
  rooms_schedules_ids?: never;

  @IsOptional()
  reset_token?: string | null;

  @IsArray()
  @Validate(IsNumberArray, {
    message: 'services_to_add only allows an array of numbers',
  })
  @IsOptional()
  services_to_add?: number[];

  @IsArray()
  @Validate(IsNumberArray, {
    message: 'services_to_delete only allows an array of numbers',
  })
  @IsOptional()
  services_to_delete?: number[];

  @IsArray()
  @Validate(IsNumberArray, {
    message: 'rooms_schedules_to_add only allows an array of numbers',
  })
  @IsOptional()
  rooms_schedules_to_add?: number[];

  @IsArray()
  @Validate(IsNumberArray, {
    message: 'rooms_schedules only allows an array of numbers',
  })
  @IsOptional()
  rooms_schedules_to_delete?: number[];
}
