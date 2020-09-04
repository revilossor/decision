import { DataSet } from './DataSet';
import { Node } from './Node';

export interface DecisionTreeParams {
  classAttribute: string,
  ignoredAttributes?: string[]
}

export class DecisionTree extends Node {
  private constructor (private data: DataSet, private params: DecisionTreeParams) {
    super('__root__', `?${params.classAttribute}/${params.ignoredAttributes}`);
    if (!data.has(params.classAttribute)) {
      throw Error(`expected the class attribute '${params.classAttribute}' to be in the data`);
    }
    // TODO if ignored not present, throw
    this.split(data, this);
  }

  private split (data: DataSet, tree: Node) {
    const addLeafNode = () => {
      const decision = [...(new Set(data.getDistinctValues(this.params.classAttribute)))];
      tree.addChild(new Node(
        this.params.classAttribute.toLowerCase(),
        decision
      ));
    };

    const entropy = data.getEntropy(this.params.classAttribute);
    if (entropy === 0) {
      addLeafNode();
    } else {
      const attribute = data.getMostInformative(
        this.params.classAttribute,
        this.params.ignoredAttributes
      );
      if (attribute == null) {
        addLeafNode();
      } else {
        const values = data.getDistinctValues(attribute);
        values.forEach(value => {
          const subset = data.subset(attribute, value);
          const node = new Node(
            attribute,
            value
          );
          tree.addChild(node);
          this.split(subset, node);
        });
      }
    }
  }

  public static fromFilePath (filepath: string, params: DecisionTreeParams): DecisionTree {
    return new DecisionTree(
      DataSet.fromFilePath(filepath),
      params
    );
  }
}
