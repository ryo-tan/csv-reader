import CsvReader from "./CsvReader";

describe('CsvReader Component', () => {

    describe('Update display headers based on max number of columns allowed', () => {
        test('When max num of col is more than current display headers length', () => {
            const maxNumberOfCol = 3;
            const displayHeaders = ['one', 'two'];
            const value = CsvReader.updateDisplayHeaders(maxNumberOfCol, displayHeaders);
            expect(value).toEqual(displayHeaders);
        })

        test('When max num of col is equal to current display headers length', () => {
            const maxNumberOfCol = 2;
            const displayHeaders = ['one', 'two'];
            const value = CsvReader.updateDisplayHeaders(maxNumberOfCol, displayHeaders);
            expect(value).toEqual(displayHeaders);
        })

        test('When max num of col is less than current display headers length', () => {
            const maxNumberOfCol = 1;
            const displayHeaders = ['one', 'two'];
            const expectedDisplayHeaders = ['one'];
            const value = CsvReader.updateDisplayHeaders(maxNumberOfCol, displayHeaders);
            expect(value).toEqual(expectedDisplayHeaders);
        })
    })

})