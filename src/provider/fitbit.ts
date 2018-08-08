import { OAuthProvider, IOAuthOptions } from "../provider";

export class Fitbit extends OAuthProvider {
  
  protected APP_SCOPE_DELIMITER = ' ';

  constructor(options?: IOAuthOptions) {
    super(options);
    this.authUrl = 'https://www.fitbit.com/oauth2/authorize';
    this.defaults = {
      responseType: 'code'
    };
  }
}
