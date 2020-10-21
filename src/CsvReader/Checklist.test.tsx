import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import Checklist, { ChecklistProp, ChecklistState } from './Checklist';

describe('Checklist Component', () => {
  let wrapper: ReactWrapper<ChecklistProp, ChecklistState, Checklist>;
  beforeEach(() => {
    const props = {
      updateDisplayHeaders: () => { },
      headers: ['one', 'two', 'three', 'four', 'five'],
      displayHeaders: ['one', 'two', 'three'],
    };
    wrapper = mount(<Checklist {...props} />);
  });

  test('Map header arrays to checklist', () => {
    const list = {
      one: true,
      two: true,
      three: true,
      four: false,
      five: false,
    };
    expect(Checklist.getListState(wrapper.props().headers, wrapper.props().displayHeaders)).toEqual(list);
  });

  test('Generate display headers array from Checklist obj', () => {
    const list = {
      one: true,
      two: true,
      three: false,
      four: true,
      five: false,
    };

    const displayHeaders = ['one', 'two', 'four'];
    expect(wrapper.instance().getDisplayHeaders(list)).toEqual(displayHeaders);
  });
});
