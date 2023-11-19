import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isBefore } from 'date-fns';
import { Schedule } from './entities/schedule.entity';
import { WorkersService } from 'src/workers/workers.service';
import {
  TimeRange,
  areTimeRangesValid,
  newTime,
} from 'src/utils/timeFunctions';

@Injectable()
export class SchedulesService {
  private readonly relations = ['worker'];

  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly workersService: WorkersService,
  ) {}

  async create(schedule: CreateScheduleDto) {
    const workerFound = await this.workersService.findOne(
      schedule.worker_id,
      false,
    );

    const range: TimeRange = {
      start_time: newTime(schedule.start_time),
      end_time: newTime(schedule.end_time),
    };

    if (isBefore(range.end_time, range.start_time))
      throw new HttpException(
        'end_time is greater than startTime',
        HttpStatus.BAD_REQUEST,
      );

    const matchedSchedules = await this.scheduleRepository.find({
      where: {
        worker: workerFound,
        day: schedule.day,
      },
    });

    for (const matchSchedule of matchedSchedules) {
      const matchedRange: TimeRange = {
        start_time: newTime(matchSchedule.start_time),
        end_time: newTime(matchSchedule.end_time),
      };

      if (!areTimeRangesValid(matchedRange, range))
        throw new HttpException(
          'The range of hours has conflict with other Schedule in the same day',
          HttpStatus.CONFLICT,
        );
    }

    const newSchedule = this.scheduleRepository.create(schedule);
    newSchedule.worker = workerFound;

    return this.scheduleRepository.save(newSchedule);
  }

  findAll(complete: boolean = true) {
    return this.scheduleRepository.find({
      relations: complete ? this.relations : [],
    });
  }

  async findOne(id: number, complete: boolean = true) {
    const scheduleFound = await this.scheduleRepository.findOne({
      where: { id },
      relations: complete ? this.relations : [],
    });

    if (!scheduleFound)
      throw new HttpException('Schedule not found', HttpStatus.NOT_FOUND);

    return scheduleFound;
  }

  async update(id: number, schedule: UpdateScheduleDto) {
    const existingSchedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: this.relations,
    });

    if (!existingSchedule)
      throw new HttpException('Schedule not found', HttpStatus.NOT_FOUND);

    const workerFound = await this.workersService.findOne(
      existingSchedule.worker.id,
    );

    const range: TimeRange = {
      start_time: newTime(existingSchedule.start_time),
      end_time: newTime(existingSchedule.end_time),
    };
    if (schedule.start_time) range.start_time = newTime(schedule.start_time);
    if (schedule.end_time) range.end_time = newTime(schedule.end_time);

    if (isBefore(range.end_time, range.start_time))
      throw new HttpException(
        'end_time is greater than startTime',
        HttpStatus.BAD_REQUEST,
      );

    const matchedSchedules = await this.scheduleRepository.find({
      where: {
        worker: workerFound,
        day: schedule.day,
      },
    });

    for (const matchSchedule of matchedSchedules) {
      if (matchSchedule.id === id) continue;

      const matchedRange: TimeRange = {
        start_time: newTime(matchSchedule.start_time),
        end_time: newTime(matchSchedule.end_time),
      };

      if (!areTimeRangesValid(matchedRange, range))
        throw new HttpException(
          'The range of hours has conflict with other Schedule in the same day',
          HttpStatus.CONFLICT,
        );
    }

    this.scheduleRepository.merge(existingSchedule, schedule);
    existingSchedule.worker = workerFound;

    await this.scheduleRepository.save(existingSchedule);
    return existingSchedule;
  }

  async remove(id: number) {
    const result = await this.scheduleRepository.delete(id);

    if (result.affected === 0)
      throw new HttpException('Schedule not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
