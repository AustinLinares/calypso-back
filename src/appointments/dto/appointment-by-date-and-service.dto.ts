import { IsString, Validate } from 'class-validator';
import { IsNumberArray } from 'src/utils/customValidators/IsNumberArray';
import { IsShortDate } from 'src/utils/customValidators/IsShortDate';

export class AppointmentByDateAndServiceDto {
  @IsString()
  @Validate(IsShortDate, {
    message: 'Invalid date, the format is dd-mm-yyyy',
  })
  date: string;

  @Validate(IsNumberArray, {
    message: 'Only accepts a array of numbers (rooms_ids)',
  })
  rooms_ids: number[];
}
