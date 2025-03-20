import { ApiProperty } from '@nestjs/swagger';

class UserResponseDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  cpfCnpj: string;

  @ApiProperty()
  whitelabelId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ResponseGetAllUsersDTO {
  @ApiProperty({ type: [UserResponseDTO] })
  users: UserResponseDTO[];

  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  pageSize: number;
}
