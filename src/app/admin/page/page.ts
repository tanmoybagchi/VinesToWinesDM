import { Entity } from '@app/core/domain/models';

export class Page<T = {} | string> extends Entity {
  kind = '';
  identifier = '';
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
  @Reflect.metadata('design:type', Date)
  effectiveTo: Date = null;
  content: T = '' as any;
}
