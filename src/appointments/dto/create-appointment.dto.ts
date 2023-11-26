import {
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Validate,
} from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IsShortDate } from 'src/utils/customValidators/IsShortDate';
import { IsTime } from 'src/utils/customValidators/IsTime';

export class CreateAppointmentDto {
  @IsString()
  @Validate(IsShortDate, {
    message: 'Invalid Date, the correct format is dd-mm-yyyy',
  })
  date: string;

  @IsString()
  @Validate(IsTime, {
    message: 'Invalid Time, the correct format is HH:mm:ss',
  })
  start_time: string;

  // @IsString()
  // @Validate(IsTime, {
  //   message: 'Invalid Time, the correct format is HH:mm:ss',
  // })
  // end_time: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  sessions?: number;

  @IsString()
  @IsOptional()
  comment?: string;

  // @IsInt()
  // @IsPositive()
  // worker_id: number;

  @IsNumber()
  @IsPositive()
  service_id: number;

  // @IsNumber()
  // @IsPositive()
  // user_id: number;

  // @IsNumber()
  // @IsPositive()
  // room_id: number;
  @IsObject()
  user: CreateUserDto;
}
