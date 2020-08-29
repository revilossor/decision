import * as path from 'path';

import { DataSet } from '../../src/decision-tree/DataSet';

describe('Given a DataSet instance', () => {
  let instance:DataSet;

  const attributes = ['pure', 'impure', 'almost'];
  const records = [
    ['a', 'a', 'a'],
    ['a', 'a', 'a'],
    ['a', 'a', 'a'],
    ['a', 'a', 'a'],
    ['a', 'a', 'a'],
    ['a', 'a', 'a'],
    ['a', 'a', 'a'],
    ['a', 'b', 'a'],
    ['a', 'b', 'a'],
    ['a', 'b', 'b'],
    ['a', 'b', 'b'],
    ['a', 'b', 'b'],
    ['a', 'b', 'b'],
    ['a', 'b', 'b']
  ];

  beforeEach(() => {
    instance = new DataSet(attributes, ...records);
  });

  describe('When I get the entropy of an attribute', () => {
    it('Then the correct values are returned', () => {
      expect(instance.getEntropy('pure')).toBe(0);
      expect(instance.getEntropy('impure')).toBe(1);
      expect(instance.getEntropy('almost')).toBe(0.9402859586706309);
    });
    it('And the case of the attribute is ignored', () => {
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
