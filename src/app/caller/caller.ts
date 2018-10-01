import { ValueObject } from '@app/core/domain/models';

export class Caller {
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
  content = new CallerContent();
}

export class CallerContent extends ValueObject {
  title = '';
  location = '';
}
