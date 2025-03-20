import { Controller, Get, Logger, Query } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import {
  ErrorUserController,
  GetAllUsersControllerMessage,
} from '../../../shared/logger/message';
import { ApplicationError } from '../../../shared/types/application-error';
import { IresponseGetUsers } from '../contract/response-get-users.interface';
import { ResponseGetAllUsersDTO } from '../dto/response-get-all-users.dto';
import { GetAllUsersUseCase } from '../use-case/implementation/get-all-users.use-case';
import { HandleIsertUsersUseCase } from '../use-case/implementation/handle-insert-users.use-case';

@Controller('/users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private getAllUsersUseCase: GetAllUsersUseCase) {}

  @ApiOperation({
    summary:
      'This route is responsible to retrieve all created users on database',
    description:
      'Retrieve all users from the database, displaying them in a paginated manner to the user or returning an empty array',
  })
  @ApiOkResponse({
    description: 'Returning all users with success',
    type: ResponseGetAllUsersDTO,
  })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @Get('/')
  async getAllUsers(
    @Query('pageNumber') pageNumber = 1,
    @Query('pageSize') pageSize = 10,
  ): Promise<ApplicationError | IresponseGetUsers> {
    this.logger.log(GetAllUsersControllerMessage.RETRIEVE_ALL_USERS);

    const result = await this.getAllUsersUseCase.execute({
      pageNumber,
      pageSize,
    });

    if (result.isLeft()) {
      this.logger.error(
        ErrorUserController.FAIL_GET_ALL_USERS,
        result.getValue(),
      );
      return result.getValue();
    }

    return result.getValue();
  }

  @ApiExcludeEndpoint()
  @Get('/insert-status')
  async getInsertStatus(): Promise<{
    insertedCount?: number;
    processFinished: boolean;
  }> {
    const processFinished = HandleIsertUsersUseCase.isProcessFinished();

    if (processFinished) {
      const insertedCount = HandleIsertUsersUseCase.getInsertCount();

      HandleIsertUsersUseCase.resetProcessStatus();

      return {
        insertedCount,
        processFinished: true,
      };
    } else {
      return { processFinished: false };
    }
  }
}
