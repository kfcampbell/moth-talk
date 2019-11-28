import * as axios from 'axios';
import * as cheerio from 'cheerio';

export class Scraper {

    url = 'https://themoth.org/events/results?eventLocations=6477&typesOfEvents=&eventDate=';

    public async execute() {
        try {
            const page = await this.getPage(this.url);
            const output = this.parsePage(page);
        } catch (error) {
            console.error(error);
        }
    }

    private async getPage(url: string): Promise<any> {
        const response = await axios.default.get(url);
        console.log(response.data);
        return response.data;
    }

    private parsePage(pageOutput: any): any {
        const $ = cheerio.load(pageOutput);

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
        let eventTypes = [];
        let eventThemes = [];
        for(let i = 0; i < eventContents.length; i++) {
            eventTypes.push(eventContents[i].children[1].children[0].data.trim());
            eventThemes.push(eventContents[i].children[3].children[0].children[0].data.trim());
        }

        const venueDetails = $('.venue-detail');
        let venues = [];
        for(let i = 0; i < venueDetails.length; i++) {
            venues.push(venueDetails[i].children[1].children[0].data.trim());
        }
    }
}
