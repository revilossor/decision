import { DataSetLoader } from './DataSetLoader';

export class DataSet {
  public records: string[][]
  public attributes: string[]

  constructor (attributes: string[], ...records: string[][]) {
    const lower = (attribute: string) => attribute.toLowerCase();
    this.attributes = attributes.map(lower);
    this.records = records.map(record => record.map(lower));
  }

  private getAttributeIndex (attribute:string): number {
    const key = attribute.toLowerCase();
    const index = this.attributes.indexOf(key);
    if (index < 0) {
      throw Error(`expected DataSet to contain attribute "${key}"`);
    }
    return index;
  }

  private getDistinctValues (attribute: string): string[] {
    const index = this.getAttributeIndex(attribute);
    return [...new Set<string>(this.records.map(record => record[index]))];
  }

  private getOccurrences (attribute:string, value: string): number {
    const index = this.getAttributeIndex(attribute);
    return this.records.reduce((count, record) => {
      return record[index] === value
        ? ++count
        : count;
    }, 0);
  }

  private getProbability (attribute: string, value: string): number {
    const p = this.getOccurrences(attribute, value) / this.records.length;
    return p * Math.log2(p);
  }

  public getEntropy (attribute: string): number {
    const values = this.getDistinctValues(attribute);
    return values.reduce((entropy, value) => {
      return entropy - this.getProbability(attribute, value);
    }, 0);
  }

  public static fromFilePath (filepath: string): DataSet {
    const [attributes, ...records] = DataSetLoader.load(filepath);
    return new DataSet(attributes, ...records);
  }
}
