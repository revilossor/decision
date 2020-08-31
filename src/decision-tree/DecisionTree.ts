import { DataSet } from './DataSet';
import { Node } from './Node';

export class QuestionNode extends Node {
  public constructor (public attribute:string, public value:string) {
    super(`${attribute}==${value}`);
  }
}
export class AnswerNode extends Node {
  public constructor (public attribute:string, public value:string) {
    super(`${attribute}=${value}`);
  }
}

export interface DecisionTreeParams {
  classAttribute: string,
  ignoredAttributes?: string[]
}

export class DecisionTree extends Node {
  private constructor (private data: DataSet, private params: DecisionTreeParams) {
    super(`?${params.classAttribute}/${params.ignoredAttributes}`);
    if (!data.has(params.classAttribute)) {
      throw Error(`expected the class attribute '${params.classAttribute}' to be in the data`);
    }
    // TODO if ignored not present, throw
    this.split(data, this);
  }

  // TODO distinguish homogenous results with > 1 member, return the set?
  private split (data: DataSet, tree: Node) {
    const entropy = data.getEntropy(this.params.classAttribute);
    if (entropy === 0) {
      const decision = data.getDistinctValues(this.params.classAttribute).pop();
      tree.addChild(new AnswerNode(
        this.params.classAttribute.toLowerCase(),
        decision
      ));
    } else {
      const attribute = data.getMostInformative(
        this.params.classAttribute,
        this.params.ignoredAttributes
      );
      const values = data.getDistinctValues(attribute);
      values.forEach(value => {
        const subset = data.subset(attribute, value);
        const node = new QuestionNode(
          attribute,
          value
        );
        tree.addChild(node);
        this.split(subset, node);
      });
    }
  }

  public static fromFilePath (filepath: string, params: DecisionTreeParams): DecisionTree {
    return new DecisionTree(
      DataSet.fromFilePath(filepath),
      params
    );
  }
}
