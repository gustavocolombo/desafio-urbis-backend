import { Prisma } from '@prisma/client';
import { ApplicationError } from '../../../shared/types/application-error';
import { Either } from '../../../shared/types/either';
import { IUseCase } from '../../../shared/types/use-case';

export interface IHandleInsertUsersInput {
  usersData: Array<Record<string, any>>;
}

export type IHandleInsertUsersOutput = Either<
  ApplicationError,
  Prisma.BatchPayload
>;
export interface IHandleInsertUsersUseCase
  extends IUseCase<IHandleInsertUsersInput, IHandleInsertUsersOutput> {}
