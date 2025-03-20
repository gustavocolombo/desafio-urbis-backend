import { ApplicationError } from '../../../shared/types/application-error';
import { Either } from '../../../shared/types/either';
import { IUseCase } from '../../../shared/types/use-case';
import { IresponseGetUsers } from '../contract/response-get-users.interface';

export interface IListAllUsersInput {
  pageNumber: number;
  pageSize: number;
}

export type IListAllUsersOutput = Either<ApplicationError, IresponseGetUsers>;
export interface IGetAllUsersUseCase
  extends IUseCase<IListAllUsersInput, IListAllUsersOutput> {}
