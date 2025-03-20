import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../config/prisma/prisma.service';
import { buildSuccess } from '../../../../shared/utils/build-success';
import {
  IGetAllUsersUseCase,
  IListAllUsersInput,
  IListAllUsersOutput,
} from '../Iget-all-users-use-case';

@Injectable()
export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private prismaService: PrismaService) {}

  async execute({
    pageNumber = 1,
    pageSize = 10,
  }: IListAllUsersInput): Promise<IListAllUsersOutput> {
    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    const users = await this.prismaService.user.findMany({
      skip,
      take: Number(take),
    });

    const totalUsers = await this.prismaService.user.count();

    const totalPages = Math.ceil(totalUsers / pageSize);

    return buildSuccess({
      users,
      totalUsers,
      totalPages,
      currentPage: pageNumber,
      pageSize,
    });
  }
}
