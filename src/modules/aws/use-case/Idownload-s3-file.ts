import { ApplicationError } from '../../../shared/types/application-error';
import { Either } from '../../../shared/types/either';
import { IUseCaseSqsConsumer } from '../../../shared/types/use-case-sqs-consumer';
import { Message } from '@aws-sdk/client-sqs';

export interface IMessage extends Message {}

export type IDownloadS3FileOutput = Either<ApplicationError, void>;
export interface IDownloadS3FileUseCase
  extends IUseCaseSqsConsumer<IMessage, IDownloadS3FileOutput> {}
