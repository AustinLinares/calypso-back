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

@Injectable()
export class RoomsService {
  private readonly relations = ['appointments', 'services', 'schedules'];

  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @Inject(forwardRef(() => ServicesService))
    private readonly servicesService: ServicesService,
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
    const roomFound = await this.roomRepository.findOne({
      where: {
        id,
      },
      relations: this.relations,
    });
    let servicesToAdd: Service[] = [];
    let filteredServices: Service[] = [];

    if (!roomFound)
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);

    if (room.add_services_ids)
      servicesToAdd = await this.servicesService.getServicesByIds(
        room.add_services_ids,
      );

    if (room.remove_services_ids)
      filteredServices = roomFound.services.filter(
        (service) => !room.remove_services_ids.includes(service.id),
      );

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
}
