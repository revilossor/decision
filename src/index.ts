import { DecisionTree } from './decision-tree'

const tree = DecisionTree.fromFile('./data/playtennis.csv')

console.dir({ tree })
