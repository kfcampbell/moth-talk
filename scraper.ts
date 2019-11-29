import { HttpClient } from './clients/httpClient';
import { IParser } from './parsers/IParser';

export class Scraper {
    private url: string;
    private httpClient: HttpClient;
    private parser: IParser;

    constructor(url: string, httpClient: HttpClient, parser: IParser) {
        this.url = url;
        this.httpClient = httpClient;
        this.parser = parser;
    }


    public async execute() {
        try {
            const page = await this.httpClient.getPage(this.url);
            const output = this.parser.parsePage(page);
        } catch (error) {
            console.error(error);
        }
    }

    // todo(kfcampbell):
    // refactor getPage to a client of some sort
    // refactor parsePage to a repository of some sort (with interface for returned object)
    // look into memory with azure functions
    // convert to azure function
    // wire up to sendgrid
}
