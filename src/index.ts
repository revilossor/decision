import { DecisionTree } from './decision-tree';

const tree = DecisionTree.fromFilePath('./data/playtennis.csv', { classAttribute: 'Decision' });

console.dir({ tree });
