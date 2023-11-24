import { IsNumber, IsString, Validate } from 'class-validator';
import { IsDayOfWeek } from 'src/utils/customValidators/IsDayOfWeek';
import { IsNumberArray } from 'src/utils/customValidators/IsNumberArray';
import { IsTime } from 'src/utils/customValidators/IsTime';

export class CreateRoomsScheduleDto {
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
  room_id: number;

  @Validate(IsNumberArray, {
    message: 'Only valid a array of numbers on workers_ids',
  })
  workers_ids: number[];
}
