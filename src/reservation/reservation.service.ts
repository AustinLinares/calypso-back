import { AppointmentsService } from './../appointments/appointments.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AvailableDaysDto } from './dto/available-days.dto';
import { ServicesService } from 'src/services/services.service';
import { RoomsService } from 'src/rooms/rooms.service';
import {
  dateFromHoursAndData,
  getDayMonthYearFromDate,
  parseDateStringToDate,
  timeOnDifferentTimeZone,
} from 'src/utils/timeFunctions';
import {
  addMinutes,
  addMonths,
  areIntervalsOverlapping,
  format,
  getDay,
  getDaysInMonth,
  isBefore,
} from 'date-fns';
import { AvailableHoursDto } from './dto/available-hours.dto';
import { Service } from 'src/services/entities/service.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { HourCandidate } from './interface/HourCandidate.interface';
import { RoomsSchedulesService } from 'src/rooms_schedules/rooms_schedules.service';
import { RoomsSchedule } from 'src/rooms_schedules/entities/rooms_schedule.entity';

@Injectable()
export class ReservationService {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly roomsService: RoomsService,
    private readonly roomsSchedulesService: RoomsSchedulesService,
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async availableDays(body: AvailableDaysDto) {
    const { service_id, date } = body;
    const daysAvailable: string[] = [];

    const user_date = parseDateStringToDate(date);
    const serviceFound = await this.servicesService.findOne(service_id);
    const rooms_ids = serviceFound.rooms.map((room) => room.id);
    const roomsFound = await this.roomsService.getRoomsByIds(rooms_ids, true);

    const filteredDays = new Set(
      roomsFound.flatMap((room) =>
        room.schedules.map((schedule) => schedule.day),
      ),
    );

    const monthDates = [
      ...this.createMonth(user_date),
      ...this.createMonth(addMonths(user_date, 1)),
    ];

    for (const monthDate of monthDates) {
      const day: number = getDay(monthDate);

      if (isBefore(monthDate, user_date)) continue;

      if (filteredDays.has(day))
        daysAvailable.push(format(monthDate, 'dd-MM-yyyy'));
    }

    return daysAvailable;
  }

  async availableHours(body: AvailableHoursDto) {
    const { service_id, date } = body;
    let hours: HourCandidate[] = [];

    const user_date: Date = parseDateStringToDate(date);
    const dayOfWeek: number = getDay(user_date);
    const [day, month, year] = getDayMonthYearFromDate(user_date);

    const serviceFound: Service =
      await this.servicesService.findOne(service_id);
    const { minutes_per_session } = serviceFound;

    const rooms_ids: number[] = serviceFound.rooms.map((room) => room.id);
    const roomsFound: Room[] = await this.roomsService.getRoomsByIds(
      rooms_ids,
      true,
    );

    const schedules_ids = roomsFound.flatMap((room) =>
      room.schedules
        .filter((schedule) => schedule.day === dayOfWeek)
        .map((schedule) => schedule.id),
    );
    const schedulesFound: RoomsSchedule[] =
      await this.roomsSchedulesService.getByIds(schedules_ids, true);

    const splitedDate = date.split('-');
    const formatedDate = `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;

    const appointments = await this.appointmentsService.getByDateAndRooms({
      date: formatedDate,
      rooms_ids,
    });

    for (const schedule of schedulesFound) {
      const { start_time, end_time, room } = schedule;

      const start = dateFromHoursAndData(start_time, day, month, year);
      const end = dateFromHoursAndData(end_time, day, month, year);
      let actual_time = start;

      while (isBefore(actual_time, end)) {
        const newHourCandidate = {
          start: actual_time,
          end: addMinutes(actual_time, minutes_per_session),
          room_id: room.id,
        };
        actual_time = addMinutes(actual_time, minutes_per_session);
        hours.push(newHourCandidate);
      }
    }

    for (const appointment of appointments) {
      const { start_time, end_time, room } = appointment;
      const start = dateFromHoursAndData(start_time, day, month, year);
      const end = dateFromHoursAndData(end_time, day, month, year);

      hours = hours.filter((hour) => {
        if (hour.room_id !== room.id) return true;

        return !areIntervalsOverlapping(
          { start, end },
          { start: hour.start, end: hour.end },
        );
      });
    }

    const cleanedHours = new Set(
      hours.map((hour) => timeOnDifferentTimeZone(hour.start)),
    );
    const availableHours = Array.from(cleanedHours);

    return availableHours;
  }

  async availableCompleteHours(body: AvailableHoursDto) {
    const { service_id, date } = body;
    let hours: HourCandidate[] = [];

    const user_date: Date = parseDateStringToDate(date);
    const dayOfWeek: number = getDay(user_date);
    const [day, month, year] = getDayMonthYearFromDate(user_date);

    const serviceFound: Service =
      await this.servicesService.findOne(service_id);
    const { minutes_per_session } = serviceFound;

    const rooms_ids: number[] = serviceFound.rooms.map((room) => room.id);
    const roomsFound: Room[] = await this.roomsService.getRoomsByIds(
      rooms_ids,
      true,
    );

    const schedules_ids = roomsFound.flatMap((room) =>
      room.schedules
        .filter((schedule) => schedule.day === dayOfWeek)
        .map((schedule) => schedule.id),
    );
    const schedulesFound: RoomsSchedule[] =
      await this.roomsSchedulesService.getByIds(schedules_ids, true);

    const splitedDate = date.split('-');
    const formatedDate = `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;

    const appointments = await this.appointmentsService.getByDateAndRooms({
      date: formatedDate,
      rooms_ids,
    });

    for (const schedule of schedulesFound) {
      const { start_time, end_time, room } = schedule;

      const start = dateFromHoursAndData(start_time, day, month, year);
      const end = dateFromHoursAndData(end_time, day, month, year);
      let actual_time = start;

      while (isBefore(actual_time, end)) {
        const newHourCandidate = {
          start: actual_time,
          end: addMinutes(actual_time, minutes_per_session),
          room_id: room.id,
        };
        actual_time = addMinutes(actual_time, minutes_per_session);
        hours.push(newHourCandidate);
      }
    }

    for (const appointment of appointments) {
      const { start_time, end_time, room } = appointment;
      const start = dateFromHoursAndData(start_time, day, month, year);
      const end = dateFromHoursAndData(end_time, day, month, year);

      hours = hours.filter((hour) => {
        if (hour.room_id !== room.id) return true;

        return !areIntervalsOverlapping(
          { start, end },
          { start: hour.start, end: hour.end },
        );
      });
    }

    const cleanedHours = new Set(
      hours.map((hour) => ({
        start: timeOnDifferentTimeZone(hour.start),
        end: timeOnDifferentTimeZone(hour.end),
        room_id: hour.room_id,
      })),
    );
    const availableHours = Array.from(cleanedHours);

    return availableHours;
  }

  createMonth(date: Date): Date[] {
    const allDays: Date[] = [];
    const numberOfDays: number = getDaysInMonth(date);
    const actualYear: number = date.getFullYear();
    const actualMonth: number = date.getMonth();

    for (let i = 1; i <= numberOfDays; i++) {
      const day = new Date(actualYear, actualMonth, i);
      allDays.push(day);
    }

    return allDays;
  }
}
