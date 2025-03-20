import { ApplicationError } from '../../../shared/types/application-error';
import { Either } from '../../../shared/types/either';
import { IUseCase } from '../../../shared/types/use-case';
import { IResponseGetWhitelabels } from '../contract/get-all-whitelabels.interface';

export interface IGetAllWhitelabelsInput {
  pageNumber: number;
  pageSize: number;
}

export type IGetAllWhitelabelsOutput = Either<
  ApplicationError,
  IResponseGetWhitelabels
>;
export interface IGetAllWhitelabelsUseCase
  extends IUseCase<IGetAllWhitelabelsInput, IGetAllWhitelabelsOutput> {}
