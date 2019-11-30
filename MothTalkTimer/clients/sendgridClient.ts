const sgMail = require('@sendgrid/mail');
import { MailData } from '@sendgrid/helpers/classes/mail';
import { MothResults } from '../parsers/mothEventParser';
import { EmailData } from '@sendgrid/helpers/classes/email-address';
import * as request from 'request';

export interface ISendgridClient {
    sendEmail(message: MailData): Promise<[request.Response, {}]>;
    composeEmail(mothResults: MothResults, destinations: EmailData[]): MailData
}

export class SendgridClient implements ISendgridClient {

    constructor(apiKey: string) {
        sgMail.setApiKey(apiKey);
    }

    // todo(kfcampbell): this should be in a separate service class but i can't be bothered to do it apparently
    public composeEmail(mothResults: MothResults, destinations: EmailData[]): MailData {
        let eventsBody = '';
        for(let i = 0; i < mothResults.formattedDays.length; i++) {
            eventsBody += `
            Theme: ${mothResults.formattedEventThemes[i]}</br>
            Type: ${mothResults.formattedEventTypes[i]}</br>
            ${mothResults.formattedVenues[i]}</br>
            Date: ${mothResults.formattedDays[i]} ${mothResults.formattedMonths[i]} ${mothResults.formattedNumericDays[i]}</br>
            ${mothResults.formattedEventTimes[i]}
            </br></br>
            `
        }
        const htmlEmailBody = `
        <h4>Consider yourself notified that upcoming Moth tickets just went on sale!</h4></br>
        <bold>Upcoming Events:</bold></br>
        ${eventsBody}
        </br></br>
        `
        return {
            to: destinations,
            from: 'moth-talk@kfcampbell.com',
            subject: 'Tickets Now On Sale For Upcoming Moth Event',
            html: htmlEmailBody
        };
    }

    public async sendEmail(message: MailData): Promise<[request.Response, {}]> {
        return await sgMail.sendMultiple(message);
    }
}