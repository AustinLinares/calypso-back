import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly relations = ['appointments'];
  private readonly publicColumns = {
    id: true,
    name: true,
    phone: true,
    email: true,
    appointments: true,
  };

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: [{ email: user.email }, { phone: user.phone }],
    });

    if (userFound)
      throw new HttpException(
        'Already exists a User with same email or phone',
        HttpStatus.CONFLICT,
      );

    const newUser = this.userRepository.create(user);

    return this.userRepository.save(newUser);
  }

  findAll(complete: boolean = true) {
    return this.userRepository.find({
      select: this.publicColumns,
      relations: complete ? this.relations : [],
    });
  }

  async findOne(id: number, complete: boolean = true) {
    const userFound = await this.userRepository.findOne({
      select: this.publicColumns,
      where: { id },
      relations: complete ? this.relations : [],
    });

    if (!userFound)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return userFound;
  }

  async update(id: number, user: UpdateUserDto) {
    const userFound = await this.userRepository.findOneBy({
      id,
    });

    if (!userFound)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (user.email && user.email !== userFound.email) {
      const isDuplicateEmail = await this.userRepository.findOneBy({
        email: user.email,
      });

      if (isDuplicateEmail)
        throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
    }

    if (user.phone && user.phone !== userFound.phone) {
      const isDuplicatePhone = await this.userRepository.findOneBy({
        phone: user.phone,
      });

      if (isDuplicatePhone)
        throw new HttpException('Phone is already in use', HttpStatus.CONFLICT);
    }

    const userUpdated = this.userRepository.merge(userFound, user);

    return this.userRepository.save(userUpdated);
  }

  async remove(id: number) {
    const result = await this.userRepository.delete({ id });

    if (result.affected === 0)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return result;
  }

  async getByEmail(email: string) {
    const userFound = await this.userRepository.findOneBy({
      email,
    });

    if (!userFound)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return userFound;
  }

  // async hasConflictingAppointment(
  //   userId: number,
  //   startTime: string,
  //   endTime: string,
  // ): Promise<boolean> {
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['appointments'],
  //   });

  //   const startDate = new Date(startTime);
  //   const endDate = new Date(endTime);

  //   if (!user) return false;

  //   const hasConflict = user.appointments.some((appointment) => {
  //     const appointmentStart = appointment.start_time;
  //     const appointmentEnd = appointment.end_time;

  //     return (
  //       (appointmentStart <= startDate && startDate < appointmentEnd) ||
  //       (appointmentStart < endDate && endDate <= appointmentEnd)
  //     );
  //   });

  //   return hasConflict;
  // }
}
