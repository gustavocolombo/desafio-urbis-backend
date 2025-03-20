import { Message, SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Consumer } from 'sqs-consumer';
import { SQSConsumerMessage } from '../../../shared/logger/message';

@Injectable()
export class SqsConsumeMessageUseCase implements OnModuleInit {
  private sqsClient: SQSClient;
  private consumer: Consumer;
  private logger = new Logger(SqsConsumeMessageUseCase.name);

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION,
    });
    this.consumer = Consumer.create({
      queueUrl: String(process.env.AWS_SQS_QUEUE_RECEIVE_EVENT),
      sqs: this.sqsClient,
      handleMessage: this.handleMessage.bind(this),
    });
  }

  async onModuleInit() {
    this.logger.debug(SQSConsumerMessage.READY_TO_RECEIVE);
    this.consumer.start();
  }

  async handleMessage(message: Message) {
    try {
      if (message) {
        const sendBodyToProcessFileCommand = {
          QueueUrl: process.env.AWS_SQS_QUEUE_RECEIVE_MESSAGE_BODY,
          MessageBody: message.Body,
        };

        const sendCommand = new SendMessageCommand(
          sendBodyToProcessFileCommand,
        );

        this.logger.debug(SQSConsumerMessage.SEND_MESSAGE_TO_NEXT_QUEUE);

        await this.sqsClient.send(sendCommand);
      } else {
        this.logger.debug('Nenhuma mensagem encontrada na fila.');
      }
    } catch (error) {
      this.logger.error('Erro ao consumir a fila', error);
    }
  }
}
