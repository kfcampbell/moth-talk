import { EmailData } from "@sendgrid/helpers/classes/email-address"

export class Constants {
    public static readonly mothSeattleUrl = 'https://themoth.org/events/results?eventLocations=6477&typesOfEvents=&eventDate=';
    public static readonly notificationTableName = 'EventDate';

    // todo(kfcampbell): move this to a settings repository
    public static getEmailRecipients(): EmailData[] {
        const semicolonDelimitedEmails = process.env['emailRecipients'];
        const emails = semicolonDelimitedEmails.split(';');
        let emailRecipients: EmailData[] = [];
        for(let i = 0; i < emails.length; i++) {
            emailRecipients.push({
                email: emails[i]
            });
        }
        return emailRecipients;
    }
}