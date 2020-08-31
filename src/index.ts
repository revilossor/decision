import { DecisionTree } from './decision-tree';

const tree = DecisionTree.fromFilePath(
  './data/playtennis.csv',
  {
    classAttribute: 'Decision',
    ignoredAttributes: ['Day']
  }
);

console.log(JSON.stringify(tree, null, 2));
