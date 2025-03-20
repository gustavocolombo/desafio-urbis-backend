export enum S3ControllerMessage {
  GENERATING_PRE_SIGNED_URL = '[GET - aws/s3/pre-signed-url] Route create pre-signed url',
}

export enum GetAllUsersControllerMessage {
  RETRIEVE_ALL_USERS = '[GET - users/] Route list all users from database',
}

export enum GetAllWhitelabelsControllerMessage {
  RETRIEVE_ALL_WHITELABELS = '[GET - whitelabels/] Route list all whitelabels from database',
}

export enum CreateWhitelabelControllerMessage {
  CREATE_WHITELABEL = '[POST - whitelabels/] Route create a whitelabel',
}

export enum CreatePreSignedUrl {
  CREATE_PRE_SIGNED_URL = '[POST - whitelabels/] Route create a whitelabel',
}

export enum SQSConsumerMessage {
  READY_TO_RECEIVE = 'Queue send-file-api-from-s3 is ready to receive messages',
  SEND_MESSAGE_TO_NEXT_QUEUE = 'Queue send-file-api-from-s3 sended a message',
}

export enum SQSConsumerMessageAndDownloadFileS3 {
  READY_TO_RECEIVE_FILE_METADATA = 'Queue receive-body-from-queue is ready to receive messages',
  DOWNLOADING_S3_FILE = 'Starting download file from S3',
  DOWNLOAD_S3_FILE_COMPLETED_SUCESSFULLY = 'File from S3 was downloaded successfully',
  DOWNLOAD_S3_FILE_FAILED = 'Download file from S3 was failed',
  SENDING_TO_PROCESS_DATA = 'File was downloaded, formated to JSON and sended to insert users on database',
}

export enum InsertUsersDatabase {
  INSERT_COMPLETED = 'Insert of all users was completed, please check database',
}

export enum ErrorUserController {
  FAIL_GET_ALL_USERS = 'Fail at get all users',
}

export enum ErrorWhitelabelController {
  FAIL_GET_ALL_WHITELABELS = 'Fail at get all whitelabels',
  FAIL_CREATE_WHITELABEL = 'Fail at create whitelabels',
}

export enum ErrorS3Controller {
  FAIL_CREATE_PRE_SIGNED_URL = 'Fail at create pre-signed url',
}
