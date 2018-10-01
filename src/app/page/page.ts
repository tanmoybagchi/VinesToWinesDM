import { Entity } from '@app/core/domain/models';

export class Page extends Entity {
  kind = '';
  identifier = '';
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
  @Reflect.metadata('design:type', Date)
  effectiveTo: Date = null;
  content = '';
}
