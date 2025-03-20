import { Test, TestingModule } from '@nestjs/testing';
import { Whitelabel } from '@prisma/client';
import { PrismaService } from '../../src/config/prisma/prisma.service';
import { CreateWhitelabelDTO } from '../../src/modules/whitelabels/dto/create-whitelabel.dto';
import { CreateWhitelabelUseCase } from '../../src/modules/whitelabels/use-case/implementation/create-whitelabel.use-case';

describe('CreateWhitelabelUseCase', () => {
  let useCase: CreateWhitelabelUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateWhitelabelUseCase,
        {
          provide: PrismaService,
          useValue: {
            whitelabel: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateWhitelabelUseCase>(CreateWhitelabelUseCase);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create a whitelabel successfully', async () => {
    const dto: CreateWhitelabelDTO = { name: 'Clube Sócio Vozão' };
    const mockWhitelabel: Whitelabel = {
      id: '472e6749-0f72-4e85-a2e1-0b77b74f7609',
      name: dto.name,
      url: `http://localhost:3000/whitelabel/${dto.name}/472e6749-0f72-4e85-a2e1-0b77b74f7609`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(crypto, 'randomUUID')
      .mockReturnValue('472e6749-0f72-4e85-a2e1-0b77b74f7609');
    jest
      .spyOn(prismaService.whitelabel, 'create')
      .mockResolvedValue(mockWhitelabel);

    const result = await useCase.execute(dto);

    expect(result).toEqual(mockWhitelabel);
    expect(prismaService.whitelabel.create).toHaveBeenCalledWith({
      data: {
        name: dto.name,
        url: `http://localhost:3000/whitelabel/${dto.name}/472e6749-0f72-4e85-a2e1-0b77b74f7609`,
      },
    });
  });

  it('should throw an error if whitelabel creation fails', async () => {
    const dto: CreateWhitelabelDTO = { name: 'Clube Sócio Vozão' };

    jest
      .spyOn(crypto, 'randomUUID')
      .mockReturnValue('472e6749-0f72-4e85-a2e1-0b77b74f7609');
    jest
      .spyOn(prismaService.whitelabel, 'create')
      .mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(dto)).rejects.toThrow('Database error');
  });
});
