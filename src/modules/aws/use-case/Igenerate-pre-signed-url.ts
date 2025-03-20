import { ApplicationError } from '../../../shared/types/application-error';
import { Either } from '../../../shared/types/either';
import { IUseCase } from '../../../shared/types/use-case';
import { FilenameLocatorDTO } from '../dto/file-name-locator.dto';

export interface IGeneratePreSignedUrlInput {
  fileNameLocator: FilenameLocatorDTO;
}

export type IGeneratePreSignedUrlOutput = Either<ApplicationError, string>;
export interface IGeneratePreSignedUrlUseCase
  extends IUseCase<IGeneratePreSignedUrlInput, IGeneratePreSignedUrlOutput> {}
