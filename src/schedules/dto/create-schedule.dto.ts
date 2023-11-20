import { IsNumber, IsString, Validate } from 'class-validator';
import { IsDayOfWeek } from 'src/utils/customValidators/IsDayOfWeek';
import { IsTime } from 'src/utils/customValidators/IsTime';

export class CreateScheduleDto {
  @IsNumber()
  @Validate(IsDayOfWeek, {
    message: 'Invalid day of week',
  })
  day: number;

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
  worker_id: number;
}
