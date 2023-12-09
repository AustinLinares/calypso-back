import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { IsNumberArray } from 'src/utils/customValidators/IsNumberArray';
import { IsOptional, Validate } from 'class-validator';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
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
