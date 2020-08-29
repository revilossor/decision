import { DataSetLoader } from './DataSetLoader';

export class DataSet {
  public records: string[][]
  public attributes: string[]

  constructor (attributes: string[], ...records: string[][]) {
    const lower = (attribute: string) => attribute.toLowerCase();
    this.attributes = attributes.map(lower);
    this.records = records.map(record => record.map(lower));
  }

  public getDistinctValues (attribute: string): string[] {
    const index = this.getAttributeIndex(attribute);
    return [...new Set<string>(this.records.map(record => record[index]))];
  }

  public getOccurrences (attribute:string, value: string): number {
    const index = this.getAttributeIndex(attribute);
    return this.records.reduce((count, record) => {
      return record[index] === value
        ? ++count
        : count;
    }, 0);
  }

  public getProbability (attribute: string, value: string): number {
    // TODO get probability of attribute with a value in a set - split out?
    // TODO return p(I) . log2p(I)
    return 0;
  }

  public getEntropy (attribute: string): number {
    // TODO entropy - prob for each one, subbed. some sign flipping?
    return 0;
  }

  public getAttributeIndex (attribute:string): number {
    const key = attribute.toLowerCase();
    const index = this.attributes.indexOf(key);
    if (index < 0) {
      throw Error(`expected DataSet to contain attribute "${key}"`);
    }
    return index;
  }

  public static fromFilePath (filepath: string): DataSet {
    const [attributes, ...records] = DataSetLoader.load(filepath);
    return new DataSet(attributes, ...records);
  }
}
