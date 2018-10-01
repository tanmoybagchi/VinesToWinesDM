import { ValueObject } from '@app/core/domain/models';

export class Sermon {
  content = new SermonContent();
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
}

export class SermonContent extends ValueObject {
  title = '';
  location = '';
}
