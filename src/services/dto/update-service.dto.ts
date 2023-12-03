import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsOptional, Validate } from 'class-validator';
import { IsNumberArray } from 'src/utils/customValidators/IsNumberArray';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  rooms_ids: never;
  workers_ids: never;

  @Validate(IsNumberArray, {
    message: 'Should enter an array of numbers in "add_rooms_ids"',
  })
  @IsOptional()
  add_rooms_ids?: number[];

  @Validate(IsNumberArray, {
    message: 'Should enter an array of numbers in "remove_rooms_ids"',
  })
  @IsOptional()
  remove_rooms_ids?: number[];

  @Validate(IsNumberArray, {
    message: 'Should enter an array of numbers in "add_workers_ids"',
  })
  @IsOptional()
  add_workers_ids?: number[];

  @Validate(IsNumberArray, {
    message: 'Should enter an array of numbers in "remove_workers_ids"',
  })
  @IsOptional()
  remove_workers_ids?: number[];
}
