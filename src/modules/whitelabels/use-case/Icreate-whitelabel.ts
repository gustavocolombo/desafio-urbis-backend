import { ApplicationError } from '../../../shared/types/application-error';
import { Either } from '../../../shared/types/either';
import { IUseCase } from '../../../shared/types/use-case';
import { ResponseCreateWhitelabelDTO } from '../dto/create-whitelabel.dto';

export interface ICreateWhitelabelsInput {
  name: string;
}

export type ICreateWhitelabelsOutput = Either<
  ApplicationError,
  ResponseCreateWhitelabelDTO
>;
export interface ICreateWhitelabelsUseCase
  extends IUseCase<ICreateWhitelabelsInput, ICreateWhitelabelsOutput> {}
