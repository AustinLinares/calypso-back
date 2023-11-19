import { SessionState } from '../interfaces/SessionState';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateAppointmentDto {
  @IsEnum(SessionState, {
    message: 'State must be one of: pending, booked, completed, canceled',
  })
  @IsOptional()
  state?: SessionState;
}
