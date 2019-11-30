import * as cheerio from 'cheerio';

// this is a bit of a smell but i can't be bothered to fix it now apparently
export interface MothResults {
    formattedDays: string[],
    formattedMonths: string[],
    formattedNumericDays: string[],
    formattedEventTimes: string[],
    formattedEventTypes: string[],
    formattedEventThemes: string[],
    formattedVenues: string[]
}

export interface IParser {
    parsePage(page: any): any;
}

export class MothEventParser implements IParser {
    public parsePage(page: any): MothResults {
        const $ = cheerio.load(page);

        // datetime information
        const days = $('.day');
        const months = $('.month');
        const numericDays = $('.numeric-day');
        const eventTimes = $('.event-time');

        let formattedDays: string[] = [];
        for(let i = 0; i < days.length; i++) {
            formattedDays.push(days[i].children[0].data.trim());
        }

        let formattedMonths: string[] = [];
        for(let i = 0; i < months.length; i++) {
            formattedMonths.push(months[i].children[0].data.trim());
        }

        let formattedNumericDays: string[] = [];
        for(let i = 0; i < numericDays.length; i++) {
            formattedNumericDays.push(numericDays[i].children[0].data.trim());
        }

        let formattedEventTimes: string[] = []
        for(let i = 0; i < eventTimes.length; i++) {
            formattedEventTimes.push(eventTimes[i].children[0].data.trim());
        }

        // event type, theme, venue, time
        const eventContents = $('.event-content');
        let formattedEventTypes = [];
        let formattedEventThemes = [];
        for(let i = 0; i < eventContents.length; i++) {
            formattedEventTypes.push(eventContents[i].children[1].children[0].data.trim());
            formattedEventThemes.push(eventContents[i].children[3].children[0].children[0].data.trim());
        }

        const venueDetails = $('.venue-detail');
        let formattedVenues = [];
        for(let i = 0; i < venueDetails.length; i++) {
            formattedVenues.push(venueDetails[i].children[1].children[0].data.trim());
        }

        return {
            formattedDays,
            formattedMonths,
            formattedNumericDays,
            formattedEventTimes,
            formattedEventTypes,
            formattedEventThemes,
            formattedVenues
        };
    }

}