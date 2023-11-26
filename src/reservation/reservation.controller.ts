import { Public } from 'src/auth/decorators/public.decorator';
import { AvailableDaysDto } from './dto/available-days.dto';
import { ReservationService } from './reservation.service';
import { Body, Controller, Post } from '@nestjs/common';
import { AvailableHoursDto } from './dto/available-hours.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Public()
  @Post('available-days')
  availableDays(@Body() body: AvailableDaysDto) {
    return this.reservationService.availableDays(body);
  }

  @Public()
  @Post('available-hours')
  availableHours(@Body() body: AvailableHoursDto) {
    return this.reservationService.availableHours(body);
  }
}
