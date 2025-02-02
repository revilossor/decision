import { DataSet } from '../../src/decision-tree/DataSet';

describe('Given a DataSet instance', () => {
  let instance:DataSet;

  const attributes = ['pure', 'impure', 'almost', 'decision'];
  const records = [
    ['a', 'a', 'a', 'yes'],
    ['a', 'a', 'a', 'no'],
    ['a', 'a', 'a', 'yes'],
    ['a', 'a', 'a', 'no'],
    ['a', 'a', 'a', 'yes'],
    ['a', 'a', 'a', 'no'],
    ['a', 'a', 'a', 'yes'],
    ['a', 'b', 'a', 'no'],
    ['a', 'b', 'a', 'yes'],
    ['a', 'b', 'b', 'no'],
    ['a', 'b', 'b', 'yes'],
    ['a', 'b', 'b', 'no'],
    ['a', 'b', 'b', 'yes'],
    ['a', 'b', 'b', 'no']
  ];

  beforeEach(() => {
    instance = new DataSet(attributes, ...records);
  });

  describe('When I check if the instance has an attribute', () => {
    it('Then the correct result is returned', () => {
      expect(instance.has('pure')).toBe(true);
      expect(instance.has('themoon')).toBe(false);
    });
    it('And the case is ignored', () => {
      expect(instance.has('PURE')).toBe(true);
      expect(instance.has('THEMOON')).toBe(false);
    });
  });

  describe('When I get a subset of the data', () => {
    describe('Then the correct DataSet is returned', () => {
      let subset:DataSet;
      beforeEach(() => {
        subset = instance.subset('impure', 'b');
      });

      it('With the correct records', () => {
        expect(subset.records).toEqual([
          ['a', 'b', 'a', 'no'],
          ['a', 'b', 'a', 'yes'],
          ['a', 'b', 'b', 'no'],
          ['a', 'b', 'b', 'yes'],
          ['a', 'b', 'b', 'no'],
          ['a', 'b', 'b', 'yes'],
          ['a', 'b', 'b', 'no']
        ]);
      });
      it('And all attributes', () => {
        expect(subset.attributes).toEqual([
          'pure', 'impure', 'almost', 'decision'
        ]);
      });
    });
    it('And the casing of the attribute value is ignored', () => {
      expect(instance.subset('IMPURE', 'B').records).toEqual([
        ['a', 'b', 'a', 'no'],
        ['a', 'b', 'a', 'yes'],
        ['a', 'b', 'b', 'no'],
        ['a', 'b', 'b', 'yes'],
        ['a', 'b', 'b', 'no'],
        ['a', 'b', 'b', 'yes'],
        ['a', 'b', 'b', 'no']
      ]);
    });
    describe('And the attribute is not present in the data set', () => {
      it('Then an error is thrown', () => {
        const attribute = 'poop';
        const expected = Error(`expected DataSet to contain attribute "${attribute}"`);
        expect(() => instance.subset(attribute, 'b')).toThrow(expected);
      });
    });
    describe('And there are no records with the attribute value in the data set', () => {
      it('Then an empty data set is returned', () => {
        expect(instance.subset('pure', 'themoon').records).toHaveLength(0);
      });
    });
  });

  describe('When I get the information gain for an attribute in relation to another attribute', () => {
    it('Then the correct value is returned', () => {
      expect(instance.getInformationGain('decision', 'pure')).toBe(0);
      expect(instance.getInformationGain('decision', 'impure')).toBe(0.014771863965748422);
      expect(instance.getInformationGain('decision', 'almost')).toBe(0.016111606370189713);
    });
    it('And the casing of the attributes is ignored', () => {
      expect(instance.getInformationGain('dEciSion', 'imPure')).toBe(0.014771863965748422);
    });
    describe('And the attribute is not present in the data set', () => {
      it('Then an error is thrown', () => {
        const attribute = 'poop';
        const expected = Error(`expected DataSet to contain attribute "${attribute}"`);
        expect(() => instance.getInformationGain(attribute, 'pure')).toThrow(expected);
      });
    });
  });

  describe('When I get the entropy of an attribute', () => {
    it('Then the correct value is returned', () => {
      expect(instance.getEntropy('pure')).toBe(0);
      expect(instance.getEntropy('impure')).toBe(1);
      expect(instance.getEntropy('almost')).toBe(0.9402859586706309);
    });
    it('And the casing the attribute is ignored', () => {
      expect(instance.getEntropy('imPure')).toBe(1);
    });
    describe('And the attribute is not present in the data set', () => {
      it('Then an error is thrown', () => {
        const attribute = 'poop';
        const expected = Error(`expected DataSet to contain attribute "${attribute}"`);
        expect(() => instance.getEntropy(attribute)).toThrow(expected);
      });
    });
  });

  describe('When I get the most informative attribute', () => {
    it('Then the correct value is returned', () => {
      expect(instance.getMostInformative('decision')).toBe('almost');
    });
  });
});

describe('Given a different DataSet, with > 2 decision classes', () => {
  let instance:DataSet;

  const attributes = ['fast', 'loud', 'artist'];
  const records = [
    ['true', 'true', 'one'],
    ['true', 'false', 'two'],
    ['false', 'false', 'three']
  ];

  beforeEach(() => {
    instance = new DataSet(attributes, ...records);
  });

  describe('When I get the entropy of an attribute', () => {
    it('Then the correct value is returned', () => {
      expect(instance.getEntropy('fast')).toBe(0.9182958340544896);
      expect(instance.getEntropy('loud')).toBe(0.9182958340544896);
      expect(instance.getEntropy('artist')).toBe(1.584962500721156);
    });
  });

  describe('When I get the most informative attribute', () => {
    it('Then the correct value is returned', () => {
      expect(instance.getMostInformative('artist')).toBe('fast');
    });
  });
});

describe('When I get a DataSet instance from a file path', () => {
  describe('And the file path is valid', () => {
    describe('And the file contents are valid', () => {
      let instance: DataSet;

      beforeEach(() => {
        instance = DataSet.fromFilePath('./test/fixtures/playtennis.csv');
      });

      it('Then the data set has the correct lowercase attributes', () => {
        expect(instance.attributes).toEqual([
          'day', 'outlook', 'temp', 'humidity', 'wind', 'decision'
        ]);
      });
      it('And the correct lowercase records', () => {
        expect(instance.records).toEqual([
          ['1', 'sunny', 'hot', 'high', 'weak', 'no'],
          ['2', 'sunny', 'hot', 'high', 'strong', 'no'],
          ['3', 'overcast', 'hot', 'high', 'weak', 'yes'],
          ['4', 'rain', 'mild', 'high', 'weak', 'yes'],
          ['5', 'rain', 'cool', 'normal', 'weak', 'yes'],
          ['6', 'rain', 'cool', 'normal', 'strong', 'no'],
          ['7', 'overcast', 'cool', 'normal', 'strong', 'yes'],
          ['8', 'sunny', 'mild', 'high', 'weak', 'no'],
          ['9', 'sunny', 'cool', 'normal', 'weak', 'yes'],
          ['10', 'rain', 'mild', 'normal', 'weak', 'yes'],
          ['11', 'sunny', 'mild', 'normal', 'strong', 'yes'],
          ['12', 'overcast', 'mild', 'high', 'strong', 'yes'],
          ['13', 'overcast', 'hot', 'normal', 'weak', 'yes'],
          ['14', 'rain', 'mild', 'high', 'strong', 'no']
        ]);
      });
    });
  });
});
