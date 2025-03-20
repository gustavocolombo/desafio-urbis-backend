import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateWhitelabelControllerMessage,
  ErrorWhitelabelController,
  GetAllWhitelabelsControllerMessage,
} from '../../../shared/logger/message';
import { ApplicationError } from '../../../shared/types/application-error';
import { IResponseGetWhitelabels } from '../contract/get-all-whitelabels.interface';
import {
  CreateWhitelabelDTO,
  ResponseCreateWhitelabelDTO,
} from '../dto/create-whitelabel.dto';
import { ResponseGetAllWhitelabelsDTO } from '../dto/response-get-all-whitelabels.dto';
import { CreateWhitelabelUseCase } from '../use-case/implementation/create-whitelabel.use-case';
import { GetAllWhitelabelsUseCase } from '../use-case/implementation/get-all-whitelabels.use-case';

@Controller('/whitelabels')
export class WhitelabelController {
  private readonly logger = new Logger(WhitelabelController.name);

  constructor(
    private createWhitelabelUseCase: CreateWhitelabelUseCase,
    private getAllWhitelabelsUseCase: GetAllWhitelabelsUseCase,
  ) {}

  @ApiOperation({
    summary: 'This route is responsible to insert one whitelabel on database',
    description: 'Create a whitelabel and return the newly created entity',
  })
  @ApiCreatedResponse({
    description: 'Returning a created whitelabel with success',
    type: ResponseCreateWhitelabelDTO,
  })
  @Post()
  async createWhitelabel(
    @Body() { name }: CreateWhitelabelDTO,
  ): Promise<ApplicationError | ResponseCreateWhitelabelDTO> {
    this.logger.log(
      GetAllWhitelabelsControllerMessage.RETRIEVE_ALL_WHITELABELS,
    );

    const result = await this.createWhitelabelUseCase.execute({ name });

    if (result.isLeft()) {
      this.logger.error(ErrorWhitelabelController.FAIL_CREATE_WHITELABEL);
      return result.getValue();
    }

    return result.getValue();
  }

  @ApiOperation({
    summary:
      'This route is responsible to retrieve all created whitelabels on database',
    description:
      'Retrieve all whitelabels from the database, displaying them in a paginated manner to the user or returning an empty array',
  })
  @ApiOkResponse({
    description: 'Returning all whitelabels with success',
    type: ResponseGetAllWhitelabelsDTO,
  })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @Get()
  async getAllWhitelabels(
    @Query('pageNumber') pageNumber = 1,
    @Query('pageSize') pageSize = 10,
  ): Promise<ApplicationError | IResponseGetWhitelabels> {
    this.logger.log(CreateWhitelabelControllerMessage.CREATE_WHITELABEL);

    const result = await this.getAllWhitelabelsUseCase.execute({
      pageNumber,
      pageSize,
    });

    if (result.isLeft()) {
      this.logger.error(ErrorWhitelabelController.FAIL_GET_ALL_WHITELABELS);
      return result.getValue();
    }

    return result.getValue();
  }
}
