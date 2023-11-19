import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkerDto } from './create-worker.dto';
import { IsArray, IsBoolean, IsOptional, Validate } from 'class-validator';
import { IsNumberArray } from 'src/utils/customValidators/IsNumberArray';

export class UpdateWorkerDto extends PartialType(CreateWorkerDto) {
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;

  services_id: never;

  @IsArray()
  @Validate(IsNumberArray, {
    message: 'services_to_add only allows an array of numbers',
  })
  @IsOptional()
  services_to_add: number[];

  @IsArray()
  @Validate(IsNumberArray, {
    message: 'services_to_delete only allows an array of numbers',
  })
  @IsOptional()
  services_to_delete: number[];
}
