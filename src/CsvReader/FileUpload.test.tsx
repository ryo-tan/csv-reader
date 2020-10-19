import { mount, ReactWrapper } from "enzyme";
import React from "react";
import FileUpload, { FileUploadProp } from "./FileUpload";

describe('File Upload Component', () => {
    let wrapper: ReactWrapper<FileUploadProp, any, FileUpload>;
    beforeEach(() => {
        const props = {
            onFileChange: () => { },
        }
        wrapper = mount(<FileUpload {...props} />);
    });

    test('map data from csvtojson to type used in app', () => {
        const dataFromCsvToJson = [{
            field1: 'one',
            field2: 'two',
            field3: 'three',
        }, {
            field1: '1',
            field2: '2',
            field3: '3',
        }]

        const expectedData = [{ one: '1', two: '2', three: '3' }]
        expect(wrapper.instance().mapCsvResultToData(dataFromCsvToJson)).toEqual(expectedData);

        const dataWithMultipleRowsFromCsvToJson = [{
            field1: 'one',
            field2: 'two',
            field3: 'three',
        }, {
            field1: '1',
            field2: '2',
            field3: '3',
        }, {
            field1: 'ichi',
            field2: 'ni',
            field3: 'san',
        }];

        const expectedDataWithMultipleElement = [
            { one: '1', two: '2', three: '3' },
            { one: 'ichi', two: 'ni', three: 'san' }
        ];
        expect(wrapper.instance().mapCsvResultToData(dataWithMultipleRowsFromCsvToJson)).toEqual(expectedDataWithMultipleElement);

    })
})