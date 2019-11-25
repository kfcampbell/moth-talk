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
        const eventTimes = $('.')

        // event type, theme, venue, time
        const eventContents = $('.event-content');
        let eventTypes = [];
        let eventThemes = [];
        for(let i = 0; i < eventContents.length; i++) {
            eventTypes.push(eventContents[i].children[1].children[0].data);
            eventThemes.push(eventContents[i].children[3].children[0].children[0].data);
        }

        const venueDetails = $('.venue-detail');
        let venues = [];
        for(let i = 0; i < venueDetails.length; i++) {
            venues.push(venueDetails[i].children[1].children[0].data);
        }
    }
}
