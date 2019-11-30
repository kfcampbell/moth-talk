import { IHttpClient } from './clients/httpClient';
import { IParser } from './parsers/mothEventParser';
import { MothResults } from './parsers/mothEventParser';
import { ISendgridClient } from './clients/sendgridClient';
import { IAzureTableStorageRepository } from './repositories/tableStorageRepository';
import { Constants } from './constants';
import { Context } from '@azure/functions';
import { Helpers } from './utilities/helpers';

export class Scraper {
    private readonly url: string;
    private readonly httpClient: IHttpClient;
    private readonly parser: IParser;
    private readonly sendgridClient: ISendgridClient;
    private readonly azureTableStorageRepository: IAzureTableStorageRepository;
    private readonly context: Context;

    constructor(url: string, httpClient: IHttpClient, parser: IParser, sendgridClient: ISendgridClient,
                azureTableStorageRepository: IAzureTableStorageRepository, context: Context) {
        this.url = url;
        this.httpClient = httpClient;
        this.parser = parser;
        this.sendgridClient = sendgridClient;
        this.azureTableStorageRepository = azureTableStorageRepository;
        this.context = context;
    }

    public async execute() {
        try {
            const page: any = await this.httpClient.getPage(this.url);
            const parsedResults: MothResults = this.parser.parsePage(page);

            const azureTablePreferences = this.azureTableStorageRepository.getTablePreferences(Constants.notificationTableName);
            const previouslyNotifiedEvents = await this.azureTableStorageRepository.getValuePairs(azureTablePreferences);

            let emailShouldBeSent = false;
            for (let i = 0; i < parsedResults.formattedMonths.length; i++) {
                const key = Helpers.getDateKey(parsedResults, i);

                const ticketsOnSale = parsedResults.ticketsOnSale[i];
                const eventInTable = this.azureTableStorageRepository.keyExists(key, previouslyNotifiedEvents);

                // only notify if date not in db and tickets on sale
                if (ticketsOnSale && !eventInTable) {
                    // hardcoding 'true' because each row needs a PartitionKey and a RowKey
                    await this.azureTableStorageRepository.saveKeyValuePair(key, 'true', azureTablePreferences);
                    emailShouldBeSent = true;
                }
            }

            if(emailShouldBeSent) {
                const email = this.sendgridClient.composeEmail(parsedResults, Constants.getEmailRecipients());
                const result = await this.sendgridClient.sendEmail(email);
            } else {
                this.context.log(`No new content. No email sent.`)
            }
            this.context.log(`Execution finished.`);

        } catch (error) {
            this.context.log.error(`Error calling scraper#execute: ${JSON.stringify(error)}`);
            throw (error);
        }
    }
}
