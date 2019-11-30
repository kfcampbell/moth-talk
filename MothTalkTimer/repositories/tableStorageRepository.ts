import * as AzureStorage from 'azure-storage';


export interface ITableStorageRepository {

}

export interface ITablePreferences {
    tableService: AzureStorage.TableService;
    tableName: string;
}

export class AzureTableStorageRepository {
    constructor() {

    }

    public async saveKeyValuePair(key: string, value: string, preferences: ITablePreferences) {
        try {

        } catch(error) {

        }
    }
}