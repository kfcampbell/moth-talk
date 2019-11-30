import * as axios from 'axios';
import { Context } from "@azure/functions";


export class HttpClient {
    private readonly context: Context;

    constructor(context: Context){
        this.context = context;
    }

    public async getPage(url: string): Promise<any> {
        try {
            this.context.log(`Getting page...`);
            const response = await axios.default.get(url);
            this.context.log(`Page acquired successfully.`);
            return response.data;
        } catch(error) {
            this.context.log.error(`Error calling httpClient#getPage(): ${JSON.stringify(error)}`);
            throw(error);
        }
    }
}