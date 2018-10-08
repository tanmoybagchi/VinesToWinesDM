import { ValueObject } from '@app/core/domain/models';

export class Ministry extends ValueObject {
  name = '';
  purpose = '';
}

export class Ministries extends ValueObject {
  header = '';
  @Reflect.metadata('design:type', Ministry)
  list: Ministry[] = [];
}
