import { Module } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { WhitelabelController } from './controller/whitelabel.controller';
import { CreateWhitelabelUseCase } from './use-case/implementation/create-whitelabel.use-case';
import { GetAllWhitelabelsUseCase } from './use-case/implementation/get-all-whitelabels.use-case';

@Module({
  imports: [],
  controllers: [WhitelabelController],
  providers: [PrismaService, CreateWhitelabelUseCase, GetAllWhitelabelsUseCase],
})
export class WhitelabelModule {}
