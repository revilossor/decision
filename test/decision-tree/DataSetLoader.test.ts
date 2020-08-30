import * as path from 'path';

import { DataSetLoader } from '../../src/decision-tree/DataSetLoader';

describe('Given a DataSetLoader class', () => {
  describe('When I load a file', () => {
    describe('And the file path is valid', () => {
      describe('And the file contents are valid', () => {
        let result:string[][];

        beforeEach(() => {
          result = DataSetLoader.load('./test/fixtures/playtennis.csv');
        });

        it('Then the result is correctly parsed', () => {
          expect(result).toEqual([
            ['Day', 'Outlook', 'Temp', 'Humidity', 'Wind', 'Decision'],
            ['1', 'Sunny', 'Hot', 'High', 'Weak', 'No'],
            ['2', 'Sunny', 'Hot', 'High', 'Strong', 'No'],
            ['3', 'Overcast', 'Hot', 'High', 'Weak', 'Yes'],
            ['4', 'Rain', 'Mild', 'High', 'Weak', 'Yes'],
            ['5', 'Rain', 'Cool', 'Normal', 'Weak', 'Yes'],
            ['6', 'Rain', 'Cool', 'Normal', 'Strong', 'No'],
            ['7', 'Overcast', 'Cool', 'Normal', 'Strong', 'Yes'],
            ['8', 'Sunny', 'Mild', 'High', 'Weak', 'No'],
            ['9', 'Sunny', 'Cool', 'Normal', 'Weak', 'Yes'],
            ['10', 'Rain', 'Mild', 'Normal', 'Weak', 'Yes'],
            ['11', 'Sunny', 'Mild', 'Normal', 'Strong', 'Yes'],
            ['12', 'Overcast', 'Mild', 'High', 'Strong', 'Yes'],
            ['13', 'Overcast', 'Hot', 'Normal', 'Weak', 'Yes'],
            ['14', 'Rain', 'Mild', 'High', 'Strong', 'No']
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
            expect(() => DataSetLoader.load(filepath)).toThrow(expectedError);
          });
        });
      });
    });
    describe('And there is a problem reading the file', () => {
      it('Then an error is thrown', () => {
        const filename = 'themoon';
        const expectedPath = path.join(__dirname, '../../', filename);
        const expectedError = Error(`there was a problem reading the file: ENOENT: no such file or directory, open '${expectedPath}'`);
        expect(() => DataSetLoader.load(filename)).toThrow(expectedError);
      });
    });
  });
});
