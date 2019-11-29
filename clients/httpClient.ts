import * as axios from 'axios';


export class HttpClient {

    public async getPage(url: string): Promise<any> {
        const response = await axios.default.get(url);
        return response.data;
    }
}