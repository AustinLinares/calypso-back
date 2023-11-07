export class CreateAppointmentDto {
  start_time: Date;
  end_time: Date;
  sessions: number;
  cost: number;
  comment?: string;
}
