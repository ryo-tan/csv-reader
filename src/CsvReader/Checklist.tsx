import React, { Component } from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { Box } from '@material-ui/core';

export interface ChecklistProp {
    displayHeaders: Array<string>;
    headers: Array<string>;
    updateDisplayHeaders(displayHeaders: Array<string>): void;
    maxNumOfCol: number;
}

export interface ChecklistState {
    list: Record<string, boolean>;
}
export default class Checklist extends Component<ChecklistProp, ChecklistState> {
    state = { list: Checklist.getListState(this.props.headers, this.props.displayHeaders) };

    updateDisplayHeaders = (displayHeaders: Array<string>) => {
      this.props.updateDisplayHeaders(displayHeaders);
    };

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        if (this.props.displayHeaders.length >= this.props.maxNumOfCol) {
          return;
        }
      } else if (this.props.displayHeaders.length === 1) {
        return;
      }
      const newList = { ...this.state.list, [event.target.name]: event.target.checked };
      this.setState((state: ChecklistState, props: ChecklistProp) => ({ list: newList }));
      this.updateDisplayHeaders(this.getDisplayHeaders(newList));
    };

    static getDerivedStateFromProps(props: ChecklistProp, state: ChecklistState) {
      return { ...state, list: Checklist.getListState(props.headers, props.displayHeaders) };
    }

    // get master header list and current displayed header list to map to checklist state
    static getListState(headers: string[], displayHeaders: string[]) {
      const checklist: Record<string, boolean> = {};
      headers.forEach((header) => {
        checklist[header] = displayHeaders.includes(header);
      });
      return checklist;
    }

    // map checklist obj to display headers array
    getDisplayHeaders(list: Record<string, boolean>): Array<string> {
      const displayHeaders: Array<string> = [];
      for (const [key, value] of Object.entries(list)) {
        if (value) {
          displayHeaders.push(key);
        }
      }
      return displayHeaders;
    }

    render() {
      const { headers, maxNumOfCol } = this.props;
      const { list } = this.state;
      return (
        <div>
          <FormControl required component="fieldset">
            {/* NOTE: can add tooltip to hint that can use a bigger screen to view more columns in table */}
            <FormLabel component="legend">
              Select up to
              {maxNumOfCol}
              {' '}
              columns for display
            </FormLabel>
            <FormGroup>
              <Box flexWrap="wrap">
                {headers.map((header) => (
                  <FormControlLabel
                    key={header}
                    control={(
                      <Checkbox
                        onChange={this.handleChange}
                        checked={list[header]}
                        name={header}
                      />
                                      )}
                    label={header}
                  />
                ))}
              </Box>
            </FormGroup>
          </FormControl>
        </div>
      );
    }
}
