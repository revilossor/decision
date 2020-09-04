import { DataSetLoader } from './DataSetLoader';

export class DataSet {
  public records: string[][]
  public attributes: string[]

  public constructor (attributes: string[], ...records: string[][]) {
    const lower = (attribute: string) => attribute.toLowerCase();
    this.attributes = attributes.map(lower);
    this.records = records.map(record => record.map(lower));
  }

  public has (attribute: string):boolean {
    return this.attributes.includes(attribute.toLowerCase());
  }

  public subset (attribute: string, value: string): DataSet {
    const index = this.getAttributeIndex(attribute);
    const pertinent = this.records.filter(record => record[index] === value.toLowerCase());
    return new DataSet(this.attributes, ...pertinent);
  }

  private getAttributeIndex (attribute:string): number {
    const key = attribute.toLowerCase();
    const index = this.attributes.indexOf(key);
    if (index < 0) {
      throw Error(`expected DataSet to contain attribute "${key}"`);
    }
    return index;
  }

  public getDistinctValues (attribute: string): string[] {
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
    const result = values.reduce((entropy, value) => {
      return entropy + this.getProbability(attribute, value);
    }, 0);
    return Math.abs(result);
  }

  public getInformationGain (to: string, of: string): number {
    const values = this.getDistinctValues(of);
    return values.reduce((gain, value) => {
      const p = this.getOccurrences(of, value) / this.records.length;
      const entropy = this.subset(of, value).getEntropy(to);
      return gain - (p * entropy);
    }, this.getEntropy(to));
  }

  // NOTE returns null when no attributes get us any closer to a decision
  public getMostInformative (to: string, ignore:string[] = []):string | null {
    const lowered = ignore.map(attribute => attribute.toLowerCase());
    const source = this.attributes
      .filter(attribute => attribute !== to.toLowerCase())
      .filter(attribute => !lowered.includes(attribute));

    const gains = source
      .map<number>(this.getInformationGain.bind(this, to));

    if (gains.every(gain => gain === 0)) {
      return null;
    }

    return source[gains.indexOf(Math.max(...gains))];
  }

  public static fromFilePath (filepath: string): DataSet {
    const [attributes, ...records] = DataSetLoader.load(filepath);
    return new DataSet(attributes, ...records);
  }
}
