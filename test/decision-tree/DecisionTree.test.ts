import { DecisionTree } from '../../src/decision-tree'; // import from here to check exposed correctly
import { Node } from '../../src/decision-tree/Node';

describe('When I get a DecisionTree instance from a file path', () => {
  describe('And the class attribute is not in the data', () => {
    it('Then an error is thrown', () => {
      const params = {
        classAttribute: 'themoon'
      };
      const expected = Error(`expected the class attribute '${params.classAttribute}' to be in the data`);
      expect(() => DecisionTree.fromFilePath(
        './test/fixtures/playtennis.csv',
        params
      )).toThrow(expected);
    });
  });
  describe('And I choose a class attribute that is in the data', () => {
    let tree:DecisionTree;

    beforeEach(() => {
      tree = DecisionTree.fromFilePath(
        './test/fixtures/playmusic.csv',
        { classAttribute: 'Artist' }
      );
    });

    it('Then the tree is an instance of a Node', () => {
      expect(tree).toBeInstanceOf(Node);
    });

    it('And the correct tree is computed for the data set', () => {
      expect(JSON.stringify(tree)).toMatchSnapshot();
    });
  });
});
