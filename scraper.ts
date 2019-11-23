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
    public async getPage(url: string): Promise<any> {
        const response = await axios.default.get(url);
        console.log(response.data);
        return response.data;
    }
}
