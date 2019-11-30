import { MothResults } from '../parsers/mothEventParser';

export abstract class Helpers {
    // todo(kfcampbell): inject the date here
    public static getDateKey(results: MothResults, index: number) {
        return `${results.formattedMonths[index]}-${results.formattedNumericDays[index]}-${new Date().getFullYear()}-${results.formattedEventThemes[index]}`;
    }

}