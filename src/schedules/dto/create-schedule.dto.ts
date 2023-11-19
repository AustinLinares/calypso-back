import { IsNumber, IsString, Length, Validate } from 'class-validator';
import { IsDayOfWeek } from 'src/utils/customValidators/IsDayOfWeek';
import { IsTime } from 'src/utils/customValidators/IsTime';

export class CreateScheduleDto {
  @IsNumber()
  @Validate(IsDayOfWeek, {
    message: 'Invalid day of week',
  })
  day: number;

  @IsString()
  @Length(5)
  @Validate(IsTime, {
    message: 'Invalid Time',
  })
  start_time: string;

  @IsString()
  @Length(5)
  @Validate(IsTime, {
    message: 'Invalid Time',
  })
  end_time: string;

  @IsNumber()
  worker_id: number;
}
