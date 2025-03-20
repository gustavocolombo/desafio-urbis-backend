import { Right } from "../types/right";

export function buildSuccess<L, R>(value: R): Right<L, R> {
  return new Right<L, R>(value);
}
