import { DataSet } from './DataSet';

export class DecisionTree {
  private data:DataSet

  private constructor (data: DataSet) {
    this.data = data;
  }

  public static fromFile (filepath: string): DecisionTree {
    return new DecisionTree(
      DataSet.fromFilePath(filepath)
    );
  }
}
