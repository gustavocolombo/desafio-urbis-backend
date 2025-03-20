import { Module } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { UserController } from './controller/user.controller';
import { GetAllUsersUseCase } from './use-case/implementation/get-all-users.use-case';
import { HandleIsertUsersUseCase } from './use-case/implementation/handle-insert-users.use-case';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, HandleIsertUsersUseCase, GetAllUsersUseCase],
})
export class UsersModule {}
