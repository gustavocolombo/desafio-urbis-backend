import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/config/prisma/prisma.service';
import { IListAllUsersOutput } from '../../src/modules/users/use-case/Iget-all-users-use-case';
import { GetAllUsersUseCase } from '../../src/modules/users/use-case/implementation/get-all-users.use-case';

describe('GetAllUsersUseCase', () => {
  let useCase: GetAllUsersUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllUsersUseCase,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    useCase = module.get<GetAllUsersUseCase>(GetAllUsersUseCase);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return paginated users', async () => {
    const mockUsers = [
      {
        id: '472e6749-0f72-4e85-a2e1-0b77b74f7609',
        name: 'User 1',
        email: 'user1@example.com',
        cpfCnpj: '12345678901',
        whitelabelId: '0d2276d1-de12-4611-a8ef-e17bd2d5ecd7',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'add50f19-361f-4061-8f32-c833524df6f0',
        name: 'User 2',
        email: 'user2@example.com',
        cpfCnpj: '98765432100',
        whitelabelId: 'bc2064e6-66eb-4ae6-a3fe-cc8f58c0831c',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(mockUsers);
    jest.spyOn(prismaService.user, 'count').mockResolvedValue(100);

    const result: IListAllUsersOutput = await useCase.execute({
      pageNumber: 1,
      pageSize: 10,
    });

    expect(result).toEqual({
      users: mockUsers,
      totalUsers: 100,
      totalPages: 10,
      currentPage: 1,
      pageSize: 10,
    });

    expect(prismaService.user.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
    });
    expect(prismaService.user.count).toHaveBeenCalled();
  });

  it('should handle empty users list', async () => {
    jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([]);
    jest.spyOn(prismaService.user, 'count').mockResolvedValue(0);

    const result: IListAllUsersOutput = await useCase.execute({
      pageNumber: 1,
      pageSize: 10,
    });

    expect(result).toEqual({
      users: [],
      totalUsers: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10,
    });
  });
});
