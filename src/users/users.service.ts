import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (userFound)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    const newUser = this.userRepository.create(user);

    return this.userRepository.save(newUser);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const userFound = await this.userRepository.findOne({
      where: { id },
    });

    if (!userFound)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return userFound;
  }

  async update(id: number, user: UpdateUserDto) {
    const result = await this.userRepository.update({ id }, user);

    if (result.affected === 0)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const result = await this.userRepository.delete({ id });

    if (result.affected === 0)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
