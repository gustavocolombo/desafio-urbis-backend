import { Right } from './right';

export class Left<L, R> {
  private value: L;

  constructor(value: L) {
    this.value = value;
  }

  public getValue(): L {
    return this.value;
  }

  public isLeft(): this is Left<L, R> {
    return true;
  }

  public isRight(): this is Right<L, R> {
    return false;
  }
}
