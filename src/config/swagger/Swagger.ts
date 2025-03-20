import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import {
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_NAME,
  SWAGGER_API_ROOT,
} from './constants';
import { ISetupSwagger } from './contract';

class SetupSwagger implements ISetupSwagger {
  private options: Omit<OpenAPIObject, 'paths'>;

  constructor() {
    this.options = new DocumentBuilder()
      .setTitle(SWAGGER_API_NAME)
      .setDescription(SWAGGER_API_DESCRIPTION)
      .setVersion(SWAGGER_API_CURRENT_VERSION)
      .build();
  }

  public setup(app: INestApplication): void {
    const documet = SwaggerModule.createDocument(app, this.options);
    SwaggerModule.setup(SWAGGER_API_ROOT, app, documet);
  }
}

export const swagger = new SetupSwagger();
