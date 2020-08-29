import * as path from 'path'

import { DataSet } from '../../src/decision-tree/DataSet'

describe('Given a DataSet instance', () => {
  let instance:DataSet

  const attributes = [ 'outlook', 'wind', 'decision' ]
  const records = [
    ['sunny', 'low', 'yes' ],
    ['sunny', 'high', 'yes' ],
    ['rainy', 'low', 'yes' ],
    ['rainy', 'high', 'no' ],
  ]

  beforeEach(() => {
    instance = new DataSet(attributes, ...records)
  })

  describe('When I get an attribute index', () => {
    it('Then the correct index is returned', () => {
      attributes.forEach((attribute, index) => {
        expect(instance.getAttributeIndex(attribute)).toBe(index)
      })
    })
    describe('And the attribute is not present in the data set', () => {
      it('Then an error is thrown', () => {
        const attribute = 'poop'
        const expected = Error(`expected DataSet to contain attribute "${attribute}"`)
        expect(() => instance.getAttributeIndex(attribute)).toThrow(expected)
      })
    })
  })

})

describe('When I get a DataSet instance from a file path', () => {
  describe('And the file path is valid', () => {
    describe('And the file contents are valid', () => {
      let instance: DataSet

      beforeEach(() => {
        instance = DataSet.fromFilePath('./test/fixtures/playtennis.csv')
      })

      it('Then the data set has the correct attributes', () => {
        expect(instance.attributes).toEqual([
          'Day','Outlook','Temp','Humidity','Wind','Decision'
        ])
      })

      it('And the correct records', () => {
        expect(instance.records).toEqual([
          [ '1','Sunny','Hot','High','Weak','No' ],
          [ '2','Sunny','Hot','High','Strong','No' ],
          [ '3','Overcast','Hot','High','Weak','Yes' ],
          [ '4','Rain','Mild','High','Weak','Yes' ],
          [ '5','Rain','Cool','Normal','Weak','Yes' ],
          [ '6','Rain','Cool','Normal','Strong','No' ],
          [ '7','Overcast','Cool','Normal','Strong','Yes' ],
          [ '8','Sunny','Mild','High','Weak','No' ],
          [ '9','Sunny','Cool','Normal','Weak','Yes' ],
          [ '10','Rain','Mild','Normal','Weak','Yes' ],
          [ '11','Sunny','Mild','Normal','Strong','Yes' ],
          [ '12','Overcast','Mild','High','Strong','Yes' ],
          [ '13','Overcast','Hot','Normal','Weak','Yes' ],
          [ '14','Rain','Mild','High','Strong','No' ]
        ])
      })

    })
    describe('And the file contents are not valid', () => {
      describe.each([
        ['the file is empty', 'no content', './test/fixtures/empty.csv'],
        ['the file has no records', 'no records', './test/fixtures/norecords.csv'],
        ['the file a content row with a missing value', 'missing attribute value', './test/fixtures/missingattributevalue.csv'],
        ['the file a content row with an extra value', 'extra attribute value', './test/fixtures/extraattributevalue.csv']
      ])('Because %s', (_, message, filepath) => {
        it('Then an error is thrown', () => {
          const expectedError = Error(`there was a problem parsing the file: ${message}`)
          expect(() => DataSet.fromFilePath(filepath)).toThrow(expectedError)
        })
      })
    })
  })
  describe('And there is a problem reading the file', () => {
    it('Then an error is thrown', () => {
      const filename = 'themoon'
      const expectedPath = path.join(__dirname, '../../', filename)
      const expectedError = Error(`there was a problem reading the file: ENOENT: no such file or directory, open '${expectedPath}'`)
      expect(() => DataSet.fromFilePath('themoon')).toThrow(expectedError)
    })
  })
})
