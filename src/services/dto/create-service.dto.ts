import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  @IsPositive()
  minutes_per_session: number;

  @IsInt()
  @IsPositive()
  cost_per_session: number;

  @IsInt()
  @IsPositive()
  group_id: number;
}
