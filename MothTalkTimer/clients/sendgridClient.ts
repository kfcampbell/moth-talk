const sgMail = require('@sendgrid/mail');
import { Context } from "@azure/functions";
import { MailData } from '@sendgrid/helpers/classes/mail';
import { MothResults } from '../parsers/mothEventParser';
import { EmailData } from '@sendgrid/helpers/classes/email-address';
import * as request from 'request';

export interface ISendgridClient {
    sendEmail(message: MailData): Promise<[request.Response, {}]>;
    composeEmail(mothResults: MothResults, destinations: EmailData[]): MailData
}

export class SendgridClient implements ISendgridClient {
    private readonly context: Context;

    constructor(apiKey: string, context: Context) {
        this.context = context;
        sgMail.setApiKey(apiKey);
    }

    // todo(kfcampbell): this should be in a separate service class but i can't be bothered to do it apparently
    public composeEmail(mothResults: MothResults, destinations: EmailData[]): MailData {
        this.context.log(`Composing email...`);

        let eventsBody = '';
        for(let i = 0; i < mothResults.formattedDays.length; i++) {
            eventsBody += `
            Theme: ${mothResults.formattedEventThemes[i]}</br>
            Type: ${mothResults.formattedEventTypes[i]}</br>
            ${mothResults.formattedVenues[i]}</br>
            Date: ${mothResults.formattedDays[i]} ${mothResults.formattedMonths[i]} ${mothResults.formattedNumericDays[i]}</br>
            ${mothResults.formattedEventTimes[i]}</br>
            Tickets on Sale: ${this.getTicketOnSaleLanguage(mothResults.ticketsOnSale[i])}
            </br></br>
            `
        }
        const htmlEmailBody = `
        <h4>Consider yourself notified that upcoming Moth tickets just went on sale!</h4></br>
        <bold>Upcoming Events:</bold></br>
        ${eventsBody}
        </br></br>
        `

        this.context.log(`Email composed successfully.`);
        return {
            to: destinations,
            from: 'moth-talk@kfcampbell.com',
            subject: 'Tickets Now On Sale For Upcoming Moth Event',
            html: htmlEmailBody
        };
    }

    private getTicketOnSaleLanguage(ticketsOnSale: boolean) {
        return ticketsOnSale ? 'Yes! You had better buy some quick!' : 'Not yet! I\'ll keep you posted.';
    }

    public async sendEmail(message: MailData): Promise<[request.Response, {}]> {
        try {
            this.context.log(`Sending email...`);
            const result = await sgMail.sendMultiple(message);
            this.context.log(`Email sent successfully.`)
            return result;
        } catch(error) {
            this.context.log.error(`Error calling sendgridClient#sendEmail: ${JSON.stringify(error)}`);
            throw(error);
        }
    }
}