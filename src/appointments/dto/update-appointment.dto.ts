import { SessionState } from '../interfaces/SessionState.interface';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateAppointmentDto {
  @IsEnum(SessionState, {
    message: 'State must be one of: PENDING, BOOKED, COMPLETED, CANCELED',
  })
  @IsOptional()
  state?: SessionState;
}
