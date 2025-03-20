import { INestApplication } from '@nestjs/common';

export interface ISetupSwagger {
  setup(app: INestApplication): void;
}
