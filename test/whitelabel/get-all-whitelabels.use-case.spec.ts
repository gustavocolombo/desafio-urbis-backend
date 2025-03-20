import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/config/prisma/prisma.service';
import { IGetAllWhitelabelsOutput } from '../../src/modules/whitelabels/use-case/Iget-all-whitelabels';
import { GetAllWhitelabelsUseCase } from '../../src/modules/whitelabels/use-case/implementation/get-all-whitelabels.use-case';

describe('GetAllWhitelabelsUseCase', () => {
  let useCase: GetAllWhitelabelsUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllWhitelabelsUseCase,
        {
          provide: PrismaService,
          useValue: {
            whitelabel: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    useCase = module.get<GetAllWhitelabelsUseCase>(GetAllWhitelabelsUseCase);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return paginated whitelabels', async () => {
    const mockWhitelabels = [
      {
        id: '472e6749-0f72-4e85-a2e1-0b77b74f7609',
        name: 'Clube Sócio Vozão',
        url: 'http://localhost:3000/whitelabel/clube_sócio_vozão/987c7cac-66de-4a50-b460-1cf88a1a5aee',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'add50f19-361f-4061-8f32-c833524df6f0',
        name: 'Clube Clínica Sim',
        url: 'http://localhost:3000/whitelabel/clube_clínica_sim/0bb76f6c-7c79-42d4-8774-b8ae82dae8cd',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest
      .spyOn(prismaService.whitelabel, 'findMany')
      .mockResolvedValue(mockWhitelabels);
    jest.spyOn(prismaService.whitelabel, 'count').mockResolvedValue(100);

    const result: IGetAllWhitelabelsOutput = await useCase.execute({
      pageNumber: 1,
      pageSize: 10,
    });

    expect(result).toEqual({
      whitelabels: mockWhitelabels,
      totalWhitelabels: 100,
      totalPages: 10,
      currentPage: 1,
      pageSize: 10,
    });

    expect(prismaService.whitelabel.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
    });
    expect(prismaService.whitelabel.count).toHaveBeenCalled();
  });

  it('should handle empty whitelabels list', async () => {
    jest.spyOn(prismaService.whitelabel, 'findMany').mockResolvedValue([]);
    jest.spyOn(prismaService.whitelabel, 'count').mockResolvedValue(0);

    const result: IGetAllWhitelabelsOutput = await useCase.execute({
      pageNumber: 1,
      pageSize: 10,
    });

    expect(result).toEqual({
      whitelabels: [],
      totalWhitelabels: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10,
    });
  });
});
