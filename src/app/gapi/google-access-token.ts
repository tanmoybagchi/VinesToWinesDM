export class GoogleAccessToken {
  access_token = '';
  token_type = 'Bearer';
  state = '';
  expires_in = 3600;

  static convertFromFragment(fragment: string) {
    const item = new GoogleAccessToken();

    // tslint:disable-next-line:prefer-const
    let regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(fragment)) {
      switch (m) {
        case 'access_token':
          item.access_token = decodeURIComponent(m[2]);
          break;

        case 'token_type':
          item.token_type = decodeURIComponent(m[2]);
          break;

        case 'expires_in':
          item.expires_in = Number(decodeURIComponent(m[2]));
          break;

        case 'state':
          item.state = decodeURIComponent(m[2]);
          break;

        default:
          break;
      }
      item[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    return item;
  }
}
