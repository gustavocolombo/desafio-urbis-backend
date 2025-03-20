import { Module } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { HandleIsertUsersUseCase } from '../users/use-case/implementation/handle-insert-users.use-case';
import { S3Controller } from './controller/s3.controller';
import { SqsConsumeMessageUseCase } from './provider/sqs-consume-message.use-case';
import { DownloadS3FileUseCase } from './use-case/implementation/download-s3-file.use-case';
import { GeneratePreSignedUrlUseCase } from './use-case/implementation/generate-pre-signed-url.use-case';

@Module({
  imports: [],
  controllers: [S3Controller],
  providers: [
    GeneratePreSignedUrlUseCase,
    SqsConsumeMessageUseCase,
    DownloadS3FileUseCase,
    HandleIsertUsersUseCase,
    PrismaService,
  ],
})
export class AwsModule {}
