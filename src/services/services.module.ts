import { Module, forwardRef } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { GroupsModule } from 'src/groups/groups.module';
import { WorkersModule } from 'src/workers/workers.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    GroupsModule,
    forwardRef(() => WorkersModule),
    forwardRef(() => RoomsModule),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
