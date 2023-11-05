import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.entity';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
