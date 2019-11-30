import { AzureFunction, Context } from '@azure/functions'
import { Scraper } from './scraper';
import { HttpClient } from './clients/httpClient';
import { MothEventParser } from './parsers/mothEventParser';
import { SendgridClient } from './clients/sendgridClient';
import { Constants } from './constants';


const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    var timeStamp = new Date().toISOString();

    if (myTimer.IsPastDue) {
        context.log('Timer function is running late!');
    }

    const url = Constants.mothSeattleUrl;
    const httpClient = new HttpClient(context);
    const mothEventParser = new MothEventParser(context);
    const sendgridClient = new SendgridClient(process.env['sendgridApiKey'], context);
    const scraper = new Scraper(url, httpClient, mothEventParser, sendgridClient, context);
    await scraper.execute();

    context.log('Timer trigger function ran!', timeStamp);
};

export default timerTrigger;
