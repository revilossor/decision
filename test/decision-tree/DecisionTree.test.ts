import { DecisionTree } from '../../src/decision-tree';

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
});
