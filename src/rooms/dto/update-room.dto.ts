import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { IsNumberArray } from 'src/utils/customValidators/IsNumberArray';
import { IsOptional, Validate } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  services_ids: never;

  @Validate(IsNumberArray, {
    message: 'Only accepts a array of numbers (services_ids)',
  })
  @IsOptional()
  add_services_ids?: number[];

  @Validate(IsNumberArray, {
    message: 'Only accepts a array of numbers (services_ids)',
  })
  @IsOptional()
  remove_services_ids?: number[];
}
