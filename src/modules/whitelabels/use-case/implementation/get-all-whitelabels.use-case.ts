import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../config/prisma/prisma.service';
import { buildSuccess } from '../../../../shared/utils/build-success';
import {
  IGetAllWhitelabelsInput,
  IGetAllWhitelabelsOutput,
  IGetAllWhitelabelsUseCase,
} from '../Iget-all-whitelabels';

@Injectable()
export class GetAllWhitelabelsUseCase implements IGetAllWhitelabelsUseCase {
  constructor(private prismaService: PrismaService) {}

  async execute({
    pageNumber = 1,
    pageSize = 10,
  }: IGetAllWhitelabelsInput): Promise<IGetAllWhitelabelsOutput> {
    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    const whitelabels = await this.prismaService.whitelabel.findMany({
      skip,
      take: Number(take),
    });

    const totalWhitelabels = await this.prismaService.whitelabel.count();

    const totalPages = Math.ceil(totalWhitelabels / pageSize);

    return buildSuccess({
      whitelabels,
      totalWhitelabels,
      totalPages,
      currentPage: pageNumber,
      pageSize,
    });
  }
}
