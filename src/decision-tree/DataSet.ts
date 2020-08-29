import { DataSetLoader } from './DataSetLoader';

export class DataSet {
  public records: string[][]

  constructor (public attributes: string[], ...records: string[][]) {
    this.records = records;
  }

  public getDistinctValues (attribute: string): string[] {
    // TODO get values for attribute ( ignore case )
    return [];
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
    const index = this.attributes.indexOf(attribute);
    if (index < 0) {
      throw Error(`expected DataSet to contain attribute "${attribute}"`);
    }
    return index;
  }

  public static fromFilePath (filepath: string): DataSet {
    const [attributes, ...records] = DataSetLoader.load(filepath);
    return new DataSet(attributes, ...records);
  }
}
