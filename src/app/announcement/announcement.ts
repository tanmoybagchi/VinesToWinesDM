import { ValueObject } from '@app/core/domain/models';

export class Announcement {
  identifier = '';
  @Reflect.metadata('design:type', Date)
  effectiveTo: Date = null;
  content = new AnnouncementContent();
}

export class AnnouncementContent extends ValueObject {
  title = '';
  description = '';
  urgent = false;
}
