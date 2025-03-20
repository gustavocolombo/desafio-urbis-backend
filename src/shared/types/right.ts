import { Left } from './left';

export class Right<L, R> {
  private value: R;

  constructor(value: R) {
    this.value = value;
  }

  public getValue(): R {
    return this.value;
  }

  public isLeft(): this is Left<L, R> {
    return false;
  }

  public isRight(): this is Right<L, R> {
    return true;
  }
}
