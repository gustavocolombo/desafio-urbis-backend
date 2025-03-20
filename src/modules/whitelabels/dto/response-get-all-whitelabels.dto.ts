import { ApiProperty } from '@nestjs/swagger';

class WhitelabelResponseDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ResponseGetAllWhitelabelsDTO {
  @ApiProperty({ type: [WhitelabelResponseDTO] })
  whitelabels: WhitelabelResponseDTO[];

  @ApiProperty()
  totalWhitelabels: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  pageSize: number;
}
