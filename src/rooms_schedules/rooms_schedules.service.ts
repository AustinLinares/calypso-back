import { WorkersService } from 'src/workers/workers.service';
import { RoomsService } from 'src/rooms/rooms.service';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateRoomsScheduleDto } from './dto/create-rooms_schedule.dto';
import { UpdateRoomsScheduleDto } from './dto/update-rooms_schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomsSchedule } from './entities/rooms_schedule.entity';
import { In, Repository } from 'typeorm';
import { TimeRange, dateFromHours } from 'src/utils/timeFunctions';
import { areIntervalsOverlapping, isBefore } from 'date-fns';
import { Worker } from 'src/workers/entities/worker.entity';

@Injectable()
export class RoomsSchedulesService {
  private readonly relations = ['room ', 'workers'];

  constructor(
    @InjectRepository(RoomsSchedule)
    private readonly roomsScheduleRepository: Repository<RoomsSchedule>,
    private readonly roomsService: RoomsService,
    @Inject(forwardRef(() => WorkersService))
    private readonly workersService: WorkersService,
  ) {}

  async create(roomSchedule: CreateRoomsScheduleDto) {
    const roomFound = await this.roomsService.findOne(
      roomSchedule.room_id,
      false,
    );
    const workersFound = await this.workersService.getByIds(
      roomSchedule.workers_ids,
    );

    const range: TimeRange = {
      start: dateFromHours(roomSchedule.start_time),
      end: dateFromHours(roomSchedule.end_time),
    };

    if (isBefore(range.end, range.start))
      throw new HttpException(
        'end_time is greater than startTime',
        HttpStatus.BAD_REQUEST,
      );

    const matchedSchedules = await this.roomsScheduleRepository.findBy({
      room: {
        id: roomFound.id,
      },
      day: roomSchedule.day,
    });

    for (const matchSchedule of matchedSchedules) {
      const matchedRange: TimeRange = {
        start: dateFromHours(matchSchedule.start_time),
        end: dateFromHours(matchSchedule.end_time),
      };

      if (areIntervalsOverlapping(matchedRange, range))
        throw new HttpException(
          'The range of hours has conflict with other Schedule in the same day',
          HttpStatus.CONFLICT,
        );
    }

    const newRoomSchedule = this.roomsScheduleRepository.create(roomSchedule);
    newRoomSchedule.room = roomFound;
    newRoomSchedule.workers = workersFound;

    return this.roomsScheduleRepository.save(newRoomSchedule);
  }

  findAll(complete: boolean = true) {
    return this.roomsScheduleRepository.find({
      relations: complete ? this.relations : [],
    });
  }

  async findOne(id: number, complete: boolean = true) {
    const roomScheduleFound = await this.roomsScheduleRepository.findOne({
      where: { id },
      relations: complete ? this.relations : [],
    });

    if (!roomScheduleFound)
      throw new HttpException('Room Schedule not found', HttpStatus.NOT_FOUND);

    return roomScheduleFound;
  }

  async update(id: number, roomSchedule: UpdateRoomsScheduleDto) {
    const existingRoomSchedule = await this.roomsScheduleRepository.findOne({
      where: { id },
      relations: this.relations,
    });
    let workersToAdd: Worker[] = [];
    let filteredWorkers: Worker[] = [];

    if (!existingRoomSchedule)
      throw new HttpException('Schedule not found', HttpStatus.NOT_FOUND);

    const roomFound = await this.roomsService.findOne(
      existingRoomSchedule.room.id,
    );

    const range: TimeRange = {
      start: dateFromHours(existingRoomSchedule.start_time),
      end: dateFromHours(existingRoomSchedule.end_time),
    };

    if (roomSchedule.start_time)
      range.start = dateFromHours(roomSchedule.start_time);
    if (roomSchedule.end_time) range.end = dateFromHours(roomSchedule.end_time);

    if (isBefore(range.end, range.start))
      throw new HttpException(
        'end_time is greater than star_time',
        HttpStatus.BAD_REQUEST,
      );

    const matchedSchedules = await this.roomsScheduleRepository.find({
      where: {
        room: {
          id: roomFound.id,
        },
        day: roomSchedule.day,
      },
    });

    for (const matchSchedule of matchedSchedules) {
      if (matchSchedule.id === id) continue;

      const matchedRange: TimeRange = {
        start: dateFromHours(matchSchedule.start_time),
        end: dateFromHours(matchSchedule.end_time),
      };

      if (areIntervalsOverlapping(matchedRange, range))
        throw new HttpException(
          'The range of hours has conflict with other RoomSchedule in the same day',
          HttpStatus.CONFLICT,
        );
    }

    if (roomSchedule.workers_to_add)
      workersToAdd = await this.workersService.getByIds(
        roomSchedule.workers_to_add,
      );

    if (roomSchedule.workers_to_delete)
      filteredWorkers = existingRoomSchedule.workers.filter(
        (worker) => !roomSchedule.workers_to_delete.includes(worker.id),
      );

    this.roomsScheduleRepository.merge(existingRoomSchedule, roomSchedule);
    existingRoomSchedule.room = roomFound;
    existingRoomSchedule.workers = [...filteredWorkers, ...workersToAdd];

    await this.roomsScheduleRepository.save(existingRoomSchedule);
    return existingRoomSchedule;
  }

  async remove(id: number) {
    const result = await this.roomsScheduleRepository.delete({ id });

    if (result.affected === 0)
      throw new HttpException('Room Schedule not found', HttpStatus.NOT_FOUND);

    return result;
  }

  getByIds(ids: number[]) {
    return this.roomsScheduleRepository.findBy({
      id: In(ids),
    });
  }
}
