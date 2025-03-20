import { HttpStatus } from '@nestjs/common';

export class ApplicationError extends Error {
  private code: HttpStatus;
  private timestamp: number;
  private error: string;

  constructor(message: string, code: HttpStatus, error: string) {
    super(message);

    this.code = code;
    this.timestamp = new Date().getTime();
    this.error = error;
  }

  public getMessage(): string {
    return this.message;
  }

  public getCode(): HttpStatus {
    return this.code;
  }

  public getTimeStamp(): number {
    return this.timestamp;
  }

  public getError(): string {
    return this.error;
  }
}
