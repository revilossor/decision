import { DataSetLoader } from './DataSetLoader';

export class DataSet {
  public records: string[][]

  constructor (public attributes: string[], ...records: string[][]) {
    this.records = records;
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
