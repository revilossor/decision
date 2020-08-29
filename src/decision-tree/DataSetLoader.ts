import * as fs from 'fs';
import * as path from 'path';

export class DataSetLoader {
  private static loadFile (filepath: string): Buffer {
    try {
      return fs.readFileSync(path.resolve(filepath));
    } catch (e) {
      throw Error(`there was a problem reading the file: ${e.message}`);
    }
  }

  private static parseBuffer (buffer: Buffer): string[][] {
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

  public static load (filepath: string): string[][] {
    const buffer = DataSetLoader.loadFile(filepath);
    return DataSetLoader.parseBuffer(buffer);
  }
}
