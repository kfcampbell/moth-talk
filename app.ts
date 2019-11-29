import { Scraper } from './scraper';
import { HttpClient } from './clients/httpClient';
import { MothEventParser } from './parsers/mothEventParser';
import { SendgridClient } from './clients/sendgridClient';
import { Constants } from './constants';

const url = 'https://themoth.org/events/results?eventLocations=6477&typesOfEvents=&eventDate=';
const httpClient = new HttpClient();
const mothEventParser = new MothEventParser();
const sendgridClient = new SendgridClient(Constants.apiKey);
const scraper = new Scraper(url, httpClient, mothEventParser, sendgridClient);
scraper.execute();
