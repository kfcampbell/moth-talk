import { HttpClient } from './clients/httpClient';
import { IParser } from './parsers/mothEventParser';
import { MothResults } from './parsers/mothEventParser';
import { ISendgridClient } from './clients/sendgridClient';
import { Constants } from './constants';
import { Context } from '@azure/functions';

export class Scraper {
    private readonly url: string;
    private readonly httpClient: HttpClient;
    private readonly parser: IParser;
    private readonly sendgridClient: ISendgridClient;
    private readonly context: Context;

    constructor(url: string, httpClient: HttpClient, parser: IParser, sendgridClient: ISendgridClient, context: Context) {
        this.url = url;
        this.httpClient = httpClient;
        this.parser = parser;
        this.sendgridClient = sendgridClient;
        this.context = context;
    }

    public async execute() {
        try {
            const page: any = await this.httpClient.getPage(this.url);
            const parsedResults: MothResults = this.parser.parsePage(page);
            const email = this.sendgridClient.composeEmail(parsedResults, Constants.getEmailRecipients());
            const result = await this.sendgridClient.sendEmail(email);
        } catch (error) {
            this.context.log.error(`Error calling scraper#execute: ${JSON.stringify(error)}`);
            throw(error);
        }
    }

    // todo(kfcampbell):
    // look into memory with azure functions
}
