import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Consumer } from 'sqs-consumer';
import { SqsConsumeMessageUseCase } from '../../src/modules/aws/provider/sqs-consume-message.use-case';
import { SQSConsumerMessage } from '../../src/shared/logger/message';

jest.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  SendMessageCommand: jest.fn(),
}));

jest.mock('sqs-consumer', () => ({
  Consumer: {
    create: jest
      .fn()
      .mockImplementation(({ queueUrl, sqs, handleMessage }) => ({
        queueUrl,
        sqs,
        handleMessage,
        start: jest.fn(),
      })),
  },
}));

describe('SqsConsumeMessageUseCase', () => {
  let service: SqsConsumeMessageUseCase;
  let sqsClientMock: jest.Mocked<SQSClient>;
  let consumerMock: jest.Mocked<Consumer>;
  let loggerDebugSpy: jest.SpyInstance;

  beforeEach(async () => {
    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_SQS_QUEUE_RECEIVE_EVENT =
      'https://sqs.us-east-1.amazonaws.com/123456789987/send-file-api-from-s3';
    process.env.AWS_SQS_QUEUE_RECEIVE_MESSAGE_BODY =
      'https://sqs.us-east-1.amazonaws.com/123456789987/receive-body-from-queue';

    const module: TestingModule = await Test.createTestingModule({
      providers: [SqsConsumeMessageUseCase],
    }).compile();

    service = module.get<SqsConsumeMessageUseCase>(SqsConsumeMessageUseCase);
    sqsClientMock = service['sqsClient'] as jest.Mocked<SQSClient>;
    consumerMock = service['consumer'] as jest.Mocked<Consumer>;
    loggerDebugSpy = jest.spyOn(Logger.prototype, 'debug');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('it should be able to start SQSClient and consumer to listen messages', () => {
    expect(SQSClient).toHaveBeenCalledWith({ region: process.env.AWS_REGION });
    expect(Consumer.create).toHaveBeenCalledWith(
      expect.objectContaining({
        queueUrl: process.env.AWS_SQS_QUEUE_RECEIVE_EVENT,
        sqs: expect.any(Object),
        handleMessage: expect.any(Function),
      }),
    );
  });

  it('it should be able start consumer on onModuleInit start', async () => {
    await service.onModuleInit();
    expect(loggerDebugSpy).toHaveBeenCalledWith(
      SQSConsumerMessage.READY_TO_RECEIVE,
    );
    expect(consumerMock.start).toHaveBeenCalled();
  });

  it('it should be able to send a body message to next queue', async () => {
    const messageMock = {
      Body: '"Records": "[{\"s3\": {\"bucket\": {\"name\": \"desafio-urbis\"}, \"object\": {\"key\": \"mil_usuarios.xlsx\"}}}]"',
    };
    const sendCommandMock = {} as SendMessageCommand;

    (SendMessageCommand as unknown as jest.Mock).mockImplementation(
      () => sendCommandMock,
    );
    sqsClientMock.send = jest.fn().mockResolvedValue({});

    await service.handleMessage(messageMock);

    expect(SendMessageCommand).toHaveBeenCalledWith({
      QueueUrl: process.env.AWS_SQS_QUEUE_RECEIVE_MESSAGE_BODY,
      MessageBody:
        '"Records": "[{\"s3\": {\"bucket\": {\"name\": \"desafio-urbis\"}, \"object\": {\"key\": \"mil_usuarios.xlsx\"}}}]"',
    });

    expect(sqsClientMock.send).toHaveBeenCalledWith(sendCommandMock);
    expect(loggerDebugSpy).toHaveBeenCalledWith(
      SQSConsumerMessage.SEND_MESSAGE_TO_NEXT_QUEUE,
    );
  });

  it('it should not be able to send a message to next queue', async () => {
    const messageMock = {
      Body: '"Records": "[{\"s3\": {\"bucket\": {\"name\": \"desafio-urbis\"}, \"object\": {\"key\": \"mil_usuarios.xlsx\"}}}]"',
    };
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    sqsClientMock.send = jest
      .fn()
      .mockRejectedValue(new Error('Error at sending message'));

    await service.handleMessage(messageMock);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Erro ao consumir a fila',
      expect.any(Error),
    );
  });
});
