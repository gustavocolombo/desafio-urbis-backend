import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import {
  ErrorS3Controller,
  S3ControllerMessage,
} from '../../../shared/logger/message';
import { ApplicationError } from '../../../shared/types/application-error';
import { FilenameLocatorDTO } from '../dto/file-name-locator.dto';
import { GeneratePreSignedUrlUseCase } from '../use-case/implementation/generate-pre-signed-url.use-case';

@Controller('/aws')
export class S3Controller {
  private readonly logger = new Logger(S3Controller.name);

  constructor(
    private generatePreSignedUrlUseCase: GeneratePreSignedUrlUseCase,
  ) {}

  @ApiOperation({
    summary: 'This route is responsible to create a pre-signed url',
    description:
      'Create a pre-signed url to user upload a file to S3 bucket without overload API or database',
  })
  @ApiCreatedResponse({
    description: 'Returning a created pre-signed url',
    type: String,
  })
  @Post('/s3/pre-signed-url')
  async createPresignedUrl(
    @Body() fileNameLocator: FilenameLocatorDTO,
  ): Promise<ApplicationError | string> {
    this.logger.log(S3ControllerMessage.GENERATING_PRE_SIGNED_URL);

    const result = await this.generatePreSignedUrlUseCase.execute({
      fileNameLocator,
    });

    if (result.isLeft()) {
      this.logger.error(ErrorS3Controller.FAIL_CREATE_PRE_SIGNED_URL);
      return result.getValue();
    }

    return result.getValue();
  }
}
