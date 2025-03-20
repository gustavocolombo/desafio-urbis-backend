import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Message, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Consumer } from 'sqs-consumer';
import { Readable } from 'stream';
import * as xlsx from 'xlsx';
import { SQSConsumerMessageAndDownloadFileS3 } from '../../../../shared/logger/message';
import { HandleIsertUsersUseCase } from '../../../users/use-case/implementation/handle-insert-users.use-case';

@Injectable()
export class DownloadS3FileUseCase implements OnModuleInit {
  private sqsClient: SQSClient;
  private s3Client: S3Client;
  private consumer: Consumer;
  private readonly logger = new Logger(DownloadS3FileUseCase.name);

  constructor(private handleInserUsersUseCase: HandleIsertUsersUseCase) {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION,
    });
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
    });

    this.consumer = Consumer.create({
      queueUrl: String(process.env.AWS_SQS_QUEUE_RECEIVE_MESSAGE_BODY),
      sqs: this.sqsClient,
      handleMessage: this.handleMessage.bind(this),
    });
  }

  async onModuleInit() {
    this.logger.debug(
      SQSConsumerMessageAndDownloadFileS3.READY_TO_RECEIVE_FILE_METADATA,
    );
    this.consumer.start();
  }

  async handleMessage(message: Message): Promise<void> {
    try {
      if (message) {
        const parsedBody = JSON.parse(message.Body as any);

        parsedBody.Records.forEach(async (value) => {
          const downloadFile = new GetObjectCommand({
            Bucket: value.s3.bucket.name,
            Key: decodeURIComponent(value.s3.object.key.replace(/\+/g, ' ')),
          });

          const { Body } = await this.s3Client.send(downloadFile);

          this.logger.debug(
            SQSConsumerMessageAndDownloadFileS3.DOWNLOADING_S3_FILE,
          );

          let fileBuffer: Buffer;

          if (Body instanceof Readable) {
            fileBuffer = Buffer.concat(await Body.toArray());
          } else if (Body instanceof Blob) {
            fileBuffer = Buffer.from(await Body.arrayBuffer());
          } else {
            this.logger.debug(
              SQSConsumerMessageAndDownloadFileS3.DOWNLOAD_S3_FILE_FAILED,
            );
            throw new Error('Formato de Body não suportado');
          }

          this.logger.debug(
            SQSConsumerMessageAndDownloadFileS3.DOWNLOAD_S3_FILE_COMPLETED_SUCESSFULLY,
          );

          const workbook = xlsx.read(fileBuffer, { type: 'buffer' });

          let allUsersData: Array<Record<string, any>> = [];

          for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];

            const data: Array<Record<string, any>> =
              xlsx.utils.sheet_to_json(sheet);

            allUsersData = allUsersData.concat(data);
          }

          this.logger.debug(
            SQSConsumerMessageAndDownloadFileS3.SENDING_TO_PROCESS_DATA,
          );

          await this.handleInserUsersUseCase.execute({
            usersData: allUsersData,
          });
        });
      }
    } catch (error) {
      this.logger.error('Erro ao consumir mensagens da fila:', error);
    }
  }
}
