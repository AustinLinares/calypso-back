import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomsScheduleDto } from './create-rooms_schedule.dto';
import { IsArray, IsOptional, Validate } from 'class-validator';
import { IsNumberArray } from 'src/utils/customValidators/IsNumberArray';

export class UpdateRoomsScheduleDto extends PartialType(
  CreateRoomsScheduleDto,
) {
  workers_ids: never;

  @IsArray()
  @Validate(IsNumberArray, {
    message: 'workers_to_add only allows an array of numbers',
  })
  @IsOptional()
  workers_to_add?: number[];

  @IsArray()
  @Validate(IsNumberArray, {
    message: 'workers_to_delete only allows an array of numbers',
  })
  @IsOptional()
  workers_to_delete?: number[];
}
