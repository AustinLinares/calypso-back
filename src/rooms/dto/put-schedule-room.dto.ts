import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsDayOfWeek } from 'src/utils/customValidators/IsDayOfWeek';
import { IsTime } from 'src/utils/customValidators/IsTime';

class ScheduleDTO {
  @IsString()
  @Validate(IsTime, {
    message: 'Invalid Time, the correct format is HH:mm:ss',
  })
  start_time: string;

  @IsString()
  @Validate(IsTime, {
    message: 'Invalid Time, the correct format is HH:mm:ss',
  })
  end_time: string;

  @IsNumber()
  @Validate(IsDayOfWeek, {
    message: 'Invalid day of week',
  })
  day: number;
}

export class PutScheduleRoomDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDTO)
  schedules: ScheduleDTO[];
}
