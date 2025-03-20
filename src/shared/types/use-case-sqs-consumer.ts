export interface IUseCaseSqsConsumer<TInput, TOutput> {
  handleMessage(params?: TInput): Promise<TOutput>;
}