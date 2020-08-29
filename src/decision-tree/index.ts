import { DataSet } from './DataSet'

export class DecisionTree {
  private constructor(private data: DataSet) {}

  public static fromFile(filepath: string): DecisionTree {
    return new DecisionTree(
      DataSet.fromFile(filepath)
    )
  }
}
