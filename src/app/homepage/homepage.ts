import { ValueObject } from '@app/core/domain/models';

export class Homepage extends ValueObject {
  bannerPhotoIdentifier = '';
  bannerPhotoTransparency = 0.25;
  bannerTitleColor = 'white';
  bannerTitle = 'Welcome to Vines To Wines DM';
  bannerSubTitle = 'A community of faith called into being by God through Jesus Christ.';
}
