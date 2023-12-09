import { IsString, Validate } from 'class-validator';
import { IsNumberArray } from 'src/utils/customValidators/IsNumberArray';

export class CreateGroupDto {
  @IsString()
  name: string;

  @Validate(IsNumberArray, {
    message: 'Only accepts a array of numbers (services_ids)',
  })
  services_ids: number[];
}
