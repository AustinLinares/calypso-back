import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WorkersService } from './workers/workers.service';
import { AppModule } from './app.module';
import { Role } from './role/enums/role.enum';

export async function bootstrapAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const workersService = app.get(WorkersService);
  const configService = app.get(ConfigService);

  const adminEmail = configService.get('ADMIN_EMAIL');

  try {
    await workersService.getByEmail(adminEmail);
    console.log('Admin user already exists.');
  } catch (error) {
    await workersService.create({
      email: adminEmail,
      first_name: 'admin',
      last_name: 'admin',
      phone: configService.get('ADMIN_PHONE'),
      role: Role.ADMIN,
      speciality: '',
      presentation: 'The first admin',
      services_ids: [],
      rooms_schedules_ids: [],
    });
    console.log('Admin user created successfully.');
  }

  await app.close();
}
