import { IsInt, IsPositive, IsString, Validate } from 'class-validator';
import { IsShortDate } from 'src/utils/customValidators/IsShortDate';

export class AppointmentByDateAndUserDto {
  @IsString()
  @Validate(IsShortDate, {
    message: 'Invalid date, the format is dd-mm-yyyy',
  })
  date: string;

  @IsInt()
  @IsPositive()
  user_id: number;
}
