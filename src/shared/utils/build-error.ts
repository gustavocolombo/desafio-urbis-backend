import { Left } from "../types/left";

export function buildError<L, R>(error: L): Left<L, R> {
  return new Left<L, R>(error);
}
