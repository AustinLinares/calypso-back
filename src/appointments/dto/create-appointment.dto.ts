import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsDateString()
  start_time: string;

  @IsString()
  @IsDateString()
  end_time: string; // esto no va

  @IsInt()
  @IsPositive()
  sessions: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsInt()
  @IsPositive()
  worker_id: number; // esto no va

  @IsNumber()
  @IsPositive()
  service_id: number;

  @IsNumber()
  @IsPositive()
  user_id: number;
}
