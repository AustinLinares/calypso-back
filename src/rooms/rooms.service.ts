import { RoomsSchedulesService } from 'src/rooms_schedules/rooms_schedules.service';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { ServicesService } from 'src/services/services.service';
import { Service } from 'src/services/entities/service.entity';
import { PutScheduleRoomDto } from './dto/put-schedule-room.dto';

@Injectable()
export class RoomsService {
  private readonly relations = ['appointments', 'services', 'schedules'];

  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @Inject(forwardRef(() => ServicesService))
    private readonly servicesService: ServicesService,
    @Inject(forwardRef(() => RoomsSchedulesService))
    private readonly roomsSchedulesService: RoomsSchedulesService,
  ) {}

  async create(room: CreateRoomDto) {
    const roomFound = await this.roomRepository.findOne({
      relations: this.relations,
      where: {
        name: room.name,
      },
    });

    if (roomFound)
      throw new HttpException('Room already exists', HttpStatus.CONFLICT);

    const services = await this.servicesService.getServicesByIds(
      room.services_ids,
    );

    const newRoom = this.roomRepository.create(room);
    newRoom.services = services;
    newRoom.appointments = [];
    newRoom.schedules = [];

    return this.roomRepository.save(newRoom);
  }

  findAll(complete: boolean = true) {
    return this.roomRepository.find({
      relations: complete ? this.relations : [],
    });
  }

  async findOne(id: number, complete: boolean = true) {
    const roomFound = await this.roomRepository.findOne({
      relations: complete ? this.relations : [],
      where: {
        id,
      },
    });

    if (!roomFound)
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);

    return roomFound;
  }

  async update(id: number, room: UpdateRoomDto) {
    const roomFound = await this.findOne(id);
    let servicesToAdd: Service[] = [];
    let filteredServices: Service[] = roomFound.services;

    if (!roomFound) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    if (room.name && roomFound.name !== room.name) {
      const isDuplicatedName = await this.roomRepository.findOneBy({
        name: room.name,
      });

      if (isDuplicatedName)
        throw new HttpException('Room already exists', HttpStatus.CONFLICT);
    }

    if (room.add_services_ids) {
      servicesToAdd = await this.servicesService.getServicesByIds(
        room.add_services_ids,
      );
    }

    if (room.remove_services_ids) {
      filteredServices = roomFound.services.filter(
        (service) => !room.remove_services_ids.includes(service.id),
      );
    }

    const updatedRoom = this.roomRepository.merge(roomFound, room);
    updatedRoom.services = [...filteredServices, ...servicesToAdd];

    return this.roomRepository.save(updatedRoom);
  }

  async remove(id: number) {
    const result = await this.roomRepository.delete(id);

    if (result.affected === 0)
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);

    return result;
  }

  getRoomsByIds(ids: number[], complete: boolean = false) {
    return this.roomRepository.find({
      relations: complete ? this.relations : [],
      where: {
        id: In(ids),
      },
    });
  }

  async put(id: number, body: PutScheduleRoomDto) {
    const { schedules } = body;
    const room = await this.findOne(id);

    try {
      if (room.schedules) {
        for (const schedule of room.schedules) {
          await this.roomsSchedulesService.remove(schedule.id);
        }
      }
    } catch {
      throw new HttpException(
        'No se pudo completar la eliminación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      for (const schedule of schedules) {
        await this.roomsSchedulesService.create({
          ...schedule,
          room_id: id,
          workers_ids: [],
        });
      }
    } catch {
      throw new HttpException(
        'No se pudo completar la creación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'Actualización de los schedules fue exitosa' };
  }
}
