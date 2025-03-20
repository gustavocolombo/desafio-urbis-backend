import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../src/config/prisma/prisma.service';
import { UsersGateway } from '../../src/modules/users/gateway/user.gateway';
import { HandleIsertUsersUseCase } from '../../src/modules/users/use-case/implementation/handle-insert-users.use-case';
import { InsertUsersDatabase } from '../../src/shared/logger/message';

describe('HandleIsertUsersUseCase', () => {
  let useCase: HandleIsertUsersUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandleIsertUsersUseCase,
        {
          provide: PrismaService,
          useValue: {
            user: {
              createMany: jest.fn(),
            },
          },
        },
        {
          provide: UsersGateway,
          useValue: {
            sendInsertionCompleteMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<HandleIsertUsersUseCase>(HandleIsertUsersUseCase);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should insert multiple users and return BatchPayload', async () => {
    const usersData = [
      {
        email: 'user1@example.com',
        cpfCnpj: '12345678901',
        name: 'User One',
        whitelabelId: 'whitelabel-1',
      },
      {
        email: 'user2@example.com',
        cpfCnpj: '98765432100',
        name: 'User Two',
        whitelabelId: 'whitelabel-2',
      },
    ];

    const mockBatchPayload: Prisma.BatchPayload = { count: 2 };
    jest
      .spyOn(prismaService.user, 'createMany')
      .mockResolvedValue(mockBatchPayload);
    jest.spyOn(Logger.prototype, 'debug').mockImplementation();

    const result = await useCase.execute({ usersData });

    expect(result).toEqual(mockBatchPayload);
    expect(prismaService.user.createMany).toHaveBeenCalledWith({
      data: usersData,
      skipDuplicates: true,
    });
    expect(Logger.prototype.debug).toHaveBeenCalledWith(
      expect.stringContaining(InsertUsersDatabase.INSERT_COMPLETED),
    );
  });

  it('should handle database errors gracefully', async () => {
    const usersData = [
      {
        email: 'user1@example.com',
        cpfCnpj: '12345678901',
        name: 'User One',
        whitelabelId: 'whitelabel-1',
      },
    ];

    jest
      .spyOn(prismaService.user, 'createMany')
      .mockRejectedValue(new Error('Database error'));
    await expect(useCase.execute({ usersData })).rejects.toThrow(
      'Database error',
    );
  });
});
