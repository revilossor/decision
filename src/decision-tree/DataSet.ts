import * as fs from 'fs';
import * as path from 'path';

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

  private static load (filepath: string): Buffer {
    try {
      return fs.readFileSync(path.resolve(filepath));
    } catch (e) {
      throw Error(`there was a problem reading the file: ${e.message}`);
    }
  }

  private static parse (buffer: Buffer): string[][] {
    try {
      if (buffer.length === 0) {
        throw Error('no content');
      }

      const content = buffer.toString();
      const [attributesRow, ...recordRows] = content.split('\n');

      const attributes = attributesRow.split(',');

      const records = recordRows
        .map(row => row.split(','))
        .filter(row => row.length !== 1 && row[0] !== ''); // allow empty but trim

      if (records.length === 0) {
        throw Error('no records');
      }

      records.forEach(row => {
        if (row.length < attributes.length) {
          throw Error('missing attribute value');
        } else if (row.length > attributes.length) {
          throw Error('extra attribute value');
        }
      });

      return [attributes, ...records];
    } catch (e) {
      throw Error(`there was a problem parsing the file: ${e.message}`);
    }
  }

  public static fromFilePath (filepath: string): DataSet {
    const content = DataSet.load(filepath);
    const [attributes, ...records] = DataSet.parse(content);

    return new DataSet(attributes, ...records);
  }
}
