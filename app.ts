import { Scraper } from './scraper';
import { HttpClient } from './clients/httpClient';
import { MothEventParser } from './parsers/mothEventParser';

const url = 'https://themoth.org/events/results?eventLocations=6477&typesOfEvents=&eventDate=';
const httpClient = new HttpClient();
const mothEventParser = new MothEventParser();
const scraper = new Scraper(url, httpClient, mothEventParser);
scraper.execute();
