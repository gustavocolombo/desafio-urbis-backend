import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../../../config/prisma/prisma.service';
import { InsertUsersDatabase } from '../../../../shared/logger/message';
import { buildSuccess } from '../../../../shared/utils/build-success';
import {
  IHandleInsertUsersInput,
  IHandleInsertUsersOutput,
  IHandleInsertUsersUseCase,
} from '../Ihandle-insert-users.use-case';

@Injectable()
export class HandleIsertUsersUseCase implements IHandleInsertUsersUseCase {
  private readonly logger = new Logger(HandleIsertUsersUseCase.name);

  private static userInsertCount: number = 0;
  private static finishProcess: boolean = false;

  constructor(private prismaService: PrismaService) {}

  async execute({
    usersData,
  }: IHandleInsertUsersInput): Promise<IHandleInsertUsersOutput> {
    const users = usersData.map((user: User) => ({
      email: user.email,
      cpfCnpj: user.cpfCnpj,
      name: user.name,
      whitelabelId: user.whitelabelId,
    }));

    const userCreated = await this.prismaService.user.createMany({
      data: users,
      skipDuplicates: true,
    });

    this.logger.debug(InsertUsersDatabase.INSERT_COMPLETED);

    HandleIsertUsersUseCase.userInsertCount = userCreated.count;
    HandleIsertUsersUseCase.finishProcess = true;

    this.logger.debug(`Total of users created: ${userCreated.count}`);

    return buildSuccess(userCreated);
  }

  static getInsertCount(): number {
    return HandleIsertUsersUseCase.userInsertCount;
  }

  static isProcessFinished(): boolean {
    return HandleIsertUsersUseCase.finishProcess;
  }

  static resetProcessStatus(): void {
    this.finishProcess = false;
    this.userInsertCount = 0;
  }
}
