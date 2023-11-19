import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Validate,
} from 'class-validator';
import { IsNumberArray } from 'src/utils/customValidators/IsNumberArray';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  @IsPositive()
  minutes_per_session: number;

  @IsInt()
  @IsPositive()
  cost_per_session: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  group_id?: number;

  @Validate(IsNumberArray, {
    message: 'You should enter an array of workers ids',
  })
  @IsOptional()
  workers_ids?: number[];

  @Validate(IsNumberArray, {
    message: 'You should enter an array of rooms ids',
  })
  @IsOptional()
  rooms_ids?: number[];
}
