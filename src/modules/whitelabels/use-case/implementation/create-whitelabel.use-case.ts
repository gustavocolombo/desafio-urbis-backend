import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../config/prisma/prisma.service';
import { buildSuccess } from '../../../../shared/utils/build-success';
import {
  ICreateWhitelabelsInput,
  ICreateWhitelabelsOutput,
  ICreateWhitelabelsUseCase,
} from '../Icreate-whitelabel';

@Injectable()
export class CreateWhitelabelUseCase implements ICreateWhitelabelsUseCase {
  constructor(private prismaService: PrismaService) {}

  async execute({
    name,
  }: ICreateWhitelabelsInput): Promise<ICreateWhitelabelsOutput> {
    const randomTempId = crypto.randomUUID();
    const localUrl = 'http://localhost:3000';

    const whitelabel = await this.prismaService.whitelabel.create({
      data: {
        name,
        url: `${localUrl}/whitelabel/${name}/${randomTempId}`,
      },
    });

    return buildSuccess(whitelabel);
  }
}
