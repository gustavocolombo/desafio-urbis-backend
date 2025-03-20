import { IsNotEmpty, IsString } from 'class-validator';

export class QueueMessageBodyDTO {
  @IsString()
  @IsNotEmpty()
  body: string;
}
