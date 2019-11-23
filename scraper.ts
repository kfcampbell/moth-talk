import * as axios from 'axios';

export class Scraper {

    url = 'https://themoth.org/events/results?eventLocations=6477&typesOfEvents=&eventDate=';

    public async execute() {
        try {
            const page = await this.getPage(this.url);
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
        // todo(kfcampbell): do something useful with the output here
        // inspect the page for useful tags
        // put the cheerio code snippet here
        // make some magic happen
    }
}
