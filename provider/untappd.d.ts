import { OAuthProvider, IOAuthOptions } from "../provider";
export interface IUntappedOptions extends IOAuthOptions {
}
export declare class Untappd extends OAuthProvider {
    options: IUntappedOptions;
    protected authUrl: string;
    protected defaults: Object;
    constructor(options?: IUntappedOptions);
    protected optionsToDialogUrl(options: any): string;
}
