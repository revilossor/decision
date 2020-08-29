import { DataSet } from './DataSet';

export interface DecisionTreeParams {
  classAttribute: string
}

export class DecisionTree {
  private constructor (private data: DataSet, private params: DecisionTreeParams) {
    if (!data.attributes.includes(params.classAttribute)) {
      throw Error(`expected the class attribute '${params.classAttribute}' to be in the data`);
    }
    // TODO calculate the entropy for the data basded on classAttribute...
  }

  public static fromFilePath (filepath: string, params: DecisionTreeParams): DecisionTree {
    return new DecisionTree(
      DataSet.fromFilePath(filepath),
      params
    );
  }
}
