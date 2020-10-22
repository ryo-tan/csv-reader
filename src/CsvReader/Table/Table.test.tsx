import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { SearchableTableProps, SearchableTableState, SearchableTable } from './Table';

describe('SearchableTable Component', () => {
  let wrapper: ReactWrapper<SearchableTableProps, SearchableTableState, SearchableTable>;
  beforeEach(() => {
    const props = {
      data: [],
      displayHeaders: ['one', 'two', 'three'],
    };
    wrapper = mount(<SearchableTable {...props} />);
  });

  test('search filter returns filtered results', () => {
    const data = [
      { one: '1', two: '2', three: '3' },
      { one: 'ichi', two: 'ni', three: 'san' },
    ];
    const searchTermA = 't';
    const expectedResultsA: Array<Record<string, string>> = [];

    expect(wrapper.instance().filter(searchTermA, data)).toEqual(expectedResultsA);

    const searchTermB = 'i';
    const expectedResultsB = [
      { one: 'ichi', two: 'ni', three: 'san' },
    ];
    expect(wrapper.instance().filter(searchTermB, data)).toEqual(expectedResultsB);
  });
});
