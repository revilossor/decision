import { DataSet } from './DataSet';

export interface DecisionTreeParams {
  classAttribute: string
}

export class DecisionTree {
  private constructor (private data: DataSet, private params: DecisionTreeParams) {
    if (!data.has(params.classAttribute)) {
      throw Error(`expected the class attribute '${params.classAttribute}' to be in the data`);
    }
    // TODO calculate the gain for each attribute, split, etc...
  }

  // TODO node tree thing with edge labels, DecisionNode, ChoiceNode
  private split (data: DataSet) {
    // work out entropy for class attribute
    // if 0, data is completely pure; we can decide - add decision node
    // else, get best attribute from set
    // init node for attribute
    // init edge for each attribute value
    // recurse for each attribute value subset
  }

  public static fromFilePath (filepath: string, params: DecisionTreeParams): DecisionTree {
    return new DecisionTree(
      DataSet.fromFilePath(filepath),
      params
    );
  }
}
