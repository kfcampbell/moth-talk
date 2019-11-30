import * as AzureStorage from 'azure-storage';
import { Context } from '@azure/functions';

export interface IAzureTablePreferences {
    tableService: AzureStorage.TableService;
    tableName: string;
}

export interface IAzureTableStorageRepository {
    getTablePreferences(tableName: string);
    saveKeyValuePair(partitionKey: string, rowKey: string, preferences: IAzureTablePreferences);
    getValuePairs(preferences: IAzureTablePreferences);
    keyExists(key: string, queryResults: { error: any, result: any }): boolean;
}

export class AzureTableStorageRepository implements IAzureTableStorageRepository {
    private readonly context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public getTablePreferences(tableName: string): IAzureTablePreferences {
        this.context.log(`tableStorageRepository#getTablePreferences with tableName ${tableName}...`);
        const tableService = AzureStorage.createTableService();
        this.context.log(`tableStorageRepository#getTablePreferences with tableName ${tableName} successful.`);
        return {
            tableService,
            tableName
        };
    }

    public async saveKeyValuePair(partitionKey: string, rowKey: string, preferences: IAzureTablePreferences): Promise<void> {
        this.context.log(`tableStorageRepository#saveKeyValuePair with key: ${partitionKey} and value: ${rowKey}...`);
        const entity = {
            PartitionKey: { '_': `${partitionKey}` },
            RowKey: { '_': `${rowKey}` }
        };
        const tableService = AzureStorage.createTableService();

        const error = await new Promise(resolve => {
            tableService.insertEntity(preferences.tableName, entity, (error) => resolve(error));
        });
        if (error) {
            this.context.log.error(`Error calling tableStorageRepository#saveKeyValuePair#insertEntity: ${JSON.stringify(error)}`);
            throw error;
        }

        this.context.log(`tableStorageRepository#saveKeyValuePair with key: ${partitionKey} and value: ${rowKey} successful.`);
    }

    // todo(kfcampbell): strongly type this return value
    public async getValuePairs(preferences: IAzureTablePreferences): Promise<{ error: any, result: any }> {
        // todo(kfcampbell): refactor this to only get necessary data
        // todo(kfcampbell): clean up table periodically so it doesn't get out of control
        // todo(kfcampbell): optimize querying by saving token
        this.context.log(`tableStorageRepository#getValuePairs...`)
        const query = new AzureStorage.TableQuery(); // get all entries in table
        const tableService = AzureStorage.createTableService();
        const entitiesResponse: { error: any, result: any } = await new Promise(resolve => {
            tableService.queryEntities(preferences.tableName, query, null, (error, result) => resolve({ error, result }));
        });
        if (entitiesResponse.error) {
            this.context.log.error(`Error calling tableStorageRepository#getValuePairs: ${JSON.stringify(entitiesResponse.error)}`);
        }
        return entitiesResponse;
    }

    // todo(kfcampbell): move this to a service somewhere
    public keyExists(key: string, queryResults: { error: any, result: any }): boolean {
        for (let i = 0; i < queryResults.result.entries.length; i++) {
            if (key === queryResults.result.entries[i].PartitionKey._) {
                return true;
            }
        }
        return false;
    }
}