import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import FileUpload, { FileUploadProp } from './FileUpload';

describe('File Upload Component', () => {
  let wrapper: ReactWrapper<FileUploadProp, any, FileUpload>;
  beforeEach(() => {
    const props = {
      onFileChange: () => { },
    };
    wrapper = mount(<FileUpload {...props} />);
  });

  test('mapCsvResultToData', () => {
    const dataFromCsvToJson = [{
      field1: 'one',
      field2: 'two',
      field3: 'three',
    }, {
      field1: '1',
      field2: '2',
      field3: '3',
    }];

    const expectedData = [{ one: '1', two: '2', three: '3' }];
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
      { one: 'ichi', two: 'ni', three: 'san' },
    ];
    expect(wrapper.instance().mapCsvResultToData(dataWithMultipleRowsFromCsvToJson)).toEqual(expectedDataWithMultipleElement);
  });

  test('mapCsvResultToData with csv with headers only', () => {
    const dataWithHeaderOnly = [{
      field1: 'one',
      field2: 'two',
      field3: 'three',
    }];

    const emptyData: Array<Record<string, string>> = [];
    expect(wrapper.instance().mapCsvResultToData(dataWithHeaderOnly)).toEqual(emptyData);
  });

  test('mapCsvResultToData with empty csv', () => {
    const dataFromCsvToJson: Array<Record<string, string>> = [];
    const expectedData: Array<Record<string, string>> = [];
    expect(wrapper.instance().mapCsvResultToData(dataFromCsvToJson)).toEqual(expectedData);
  });
});
