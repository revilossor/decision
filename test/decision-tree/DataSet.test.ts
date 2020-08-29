import * as path from 'path';

import { DataSet } from '../../src/decision-tree/DataSet';

describe('Given a DataSet instance', () => {
  let instance:DataSet;

  const attributes = ['outlook', 'wind', 'decision'];
  const records = [
    ['sunny', 'low', 'yes'],
    ['sunny', 'high', 'yes'],
    ['rainy', 'low', 'yes'],
    ['rainy', 'high', 'no']
  ];

  beforeEach(() => {
    instance = new DataSet(attributes, ...records);
  });

  describe('When I get an attribute index', () => {
    it('Then the correct index is returned', () => {
      attributes.forEach((attribute, index) => {
        expect(instance.getAttributeIndex(attribute)).toBe(index);
      });
    });
    it('And the case of the attribute is ignored', () => {
      attributes.forEach((attribute, index) => {
        expect(instance.getAttributeIndex(attribute.toUpperCase())).toBe(index);
      });
    });
    describe('And the attribute is not present in the data set', () => {
      it('Then an error is thrown', () => {
        const attribute = 'poop';
        const expected = Error(`expected DataSet to contain attribute "${attribute}"`);
        expect(() => instance.getAttributeIndex(attribute)).toThrow(expected);
      });
    });
  });

  describe('When I get the distinct values for an attribute', () => {
    it('Then the correct values are returned', () => {
      const result = instance.getDistinctValues('outlook');
      expect(result.length).toBe(2);
      expect(result).toEqual(
        expect.arrayContaining([
          'sunny',
          'rainy'
        ])
      );
    });
  });

  describe('When I get the occurrences of a value', () => {
    it('Then the correct values are returned', () => {
      expect(instance.getOccurrences('outlook', 'sunny')).toBe(2);
      expect(instance.getOccurrences('outlook', 'rainy')).toBe(2);
      expect(instance.getOccurrences('wind', 'low')).toBe(2);
      expect(instance.getOccurrences('wind', 'high')).toBe(2);
      expect(instance.getOccurrences('decision', 'yes')).toBe(3);
      expect(instance.getOccurrences('decision', 'no')).toBe(1);
    });
  });

  describe('When I get the probablilty of an attribute value', () => {
    it('Then the correct values are returned', () => {
      expect(instance.getProbability('outlook', 'sunny')).toBe(-0.5);
      expect(instance.getProbability('outlook', 'rainy')).toBe(-0.5);
      expect(instance.getProbability('wind', 'low')).toBe(-0.5);
      expect(instance.getProbability('wind', 'high')).toBe(-0.5);
      expect(instance.getProbability('decision', 'yes')).toBe(-0.31127812445913283);
      expect(instance.getProbability('decision', 'no')).toBe(-0.5);
    });
  });

  describe('When I get the entropy of an attribute', () => {
    it('Then the correct values are returned', () => {
      expect(instance.getEntropy('outlook')).toBe(1);
      expect(instance.getEntropy('wind')).toBe(1);
      expect(instance.getEntropy('decision')).toBe(0.8112781244591328);
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
    describe('And the file contents are not valid', () => {
      describe.each([
        ['the file is empty', 'no content', './test/fixtures/empty.csv'],
        ['the file has no records', 'no records', './test/fixtures/norecords.csv'],
        ['the file a content row with a missing value', 'missing attribute value', './test/fixtures/missingattributevalue.csv'],
        ['the file a content row with an extra value', 'extra attribute value', './test/fixtures/extraattributevalue.csv']
      ])('Because %s', (_, message, filepath) => {
        it('Then an error is thrown', () => {
          const expectedError = Error(`there was a problem parsing the file: ${message}`);
          expect(() => DataSet.fromFilePath(filepath)).toThrow(expectedError);
        });
      });
    });
  });
  describe('And there is a problem reading the file', () => {
    it('Then an error is thrown', () => {
      const filename = 'themoon';
      const expectedPath = path.join(__dirname, '../../', filename);
      const expectedError = Error(`there was a problem reading the file: ENOENT: no such file or directory, open '${expectedPath}'`);
      expect(() => DataSet.fromFilePath('themoon')).toThrow(expectedError);
    });
  });
});
