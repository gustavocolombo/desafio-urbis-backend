import { Injectable, Logger } from '@nestjs/common';
import * as aws from 'aws-sdk';
import { CreatePreSignedUrl } from '../../../../shared/logger/message';
import { buildSuccess } from '../../../../shared/utils/build-success';
import {
  IGeneratePreSignedUrlInput,
  IGeneratePreSignedUrlOutput,
  IGeneratePreSignedUrlUseCase,
} from '../Igenerate-pre-signed-url';

@Injectable()
export class GeneratePreSignedUrlUseCase
  implements IGeneratePreSignedUrlUseCase
{
  private s3Client: aws.S3;
  private readonly logger = new Logger(GeneratePreSignedUrlUseCase.name);

  constructor() {
    this.s3Client = new aws.S3({
      region: process.env.AWS_REGION,
    });
  }

  async execute({
    fileNameLocator,
  }: IGeneratePreSignedUrlInput): Promise<IGeneratePreSignedUrlOutput> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `upload/${Object.values(fileNameLocator)}`,
      Expires: 60 * 5,
      ContentType: 'application/octet-stream',
    };

    this.logger.debug(CreatePreSignedUrl.CREATE_PRE_SIGNED_URL);

    const preSignedUrl = await this.s3Client.getSignedUrlPromise(
      'putObject',
      params,
    );

    return buildSuccess(JSON.stringify(preSignedUrl));
  }
}
