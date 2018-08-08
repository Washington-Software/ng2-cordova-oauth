import { OAuthProvider, IOAuthOptions } from "../provider";
export declare class Fitbit extends OAuthProvider {
    protected APP_SCOPE_DELIMITER: string;
    constructor(options?: IOAuthOptions);
}
