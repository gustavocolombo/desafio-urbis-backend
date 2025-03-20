import { Logger } from '@nestjs/common';
import * as aws from 'aws-sdk';
import { FilenameLocatorDTO } from '../../src/modules/aws/dto/file-name-locator.dto';
import { GeneratePreSignedUrlUseCase } from '../../src/modules/aws/use-case/implementation/generate-pre-signed-url.use-case';
import { CreatePreSignedUrl } from '../../src/shared/logger/message';

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    getSignedUrlPromise: jest.fn(),
  })),
}));

describe('GeneratePreSignedUrlUseCase', () => {
  let useCase: GeneratePreSignedUrlUseCase;
  let s3ClientMock: jest.Mocked<aws.S3>;
  let loggerDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_S3_BUCKET = 'desafio-urbis';

    useCase = new GeneratePreSignedUrlUseCase();
    s3ClientMock = useCase['s3Client'] as jest.Mocked<aws.S3>;

    s3ClientMock.getSignedUrlPromise.mockClear();

    loggerDebugSpy = jest.spyOn(Logger.prototype, 'debug');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a pre-signed URL', async () => {
    const fileNameLocator: FilenameLocatorDTO = {
      name: 'planilha_mil_usuarios',
    };
    const expectedUrl =
      'https://s3.desafio-urbis.amazonaws.com/upload/planilha_mil_usuarios?AWSAccessKeyId=mocked-key&Expires=300&Signature=mocked-signature';

    s3ClientMock.getSignedUrlPromise.mockResolvedValue(expectedUrl);

    const result = await useCase.execute({ fileNameLocator });

    expect(s3ClientMock.getSignedUrlPromise).toHaveBeenCalledWith('putObject', {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: 'upload/planilha_mil_usuarios',
      Expires: 60 * 5,
      ContentType: 'application/octet-stream',
    });

    expect(result).toBe(expectedUrl);
    expect(loggerDebugSpy).toHaveBeenCalledWith(
      CreatePreSignedUrl.CREATE_PRE_SIGNED_URL,
    );
    expect(result).not.toBeNull();
    expect(s3ClientMock.getSignedUrlPromise).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if getSignedUrlPromise fails', async () => {
    const fileNameLocator: FilenameLocatorDTO = {
      name: 'planilha_mil_usuarios',
    };
    s3ClientMock.getSignedUrlPromise.mockRejectedValue(
      new Error('AWS S3 error'),
    );

    await expect(useCase.execute({ fileNameLocator })).rejects.toThrow(
      'AWS S3 error',
    );
  });
});
