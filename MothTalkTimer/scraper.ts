import { HttpClient } from './clients/httpClient';
import { IParser } from './parsers/mothEventParser';
import { MothResults } from './parsers/mothEventParser';
import { ISendgridClient } from './clients/sendgridClient';
import { Constants } from './constants';

export class Scraper {
    private url: string;
    private httpClient: HttpClient;
    private parser: IParser;
    private sendgridClient: ISendgridClient

    constructor(url: string, httpClient: HttpClient, parser: IParser, sendgridClient: ISendgridClient) {
        this.url = url;
        this.httpClient = httpClient;
        this.parser = parser;
        this.sendgridClient = sendgridClient;
    }


    public async execute() {
        try {
            const page: any = await this.httpClient.getPage(this.url);
            const parsedResults: MothResults = this.parser.parsePage(page);
            const email = this.sendgridClient.composeEmail(parsedResults, Constants.emailRecipients);
            const result = await this.sendgridClient.sendEmail(email);
        } catch (error) {
            console.error(error);
        }
    }

    // todo(kfcampbell):
    // look into memory with azure functions
}
