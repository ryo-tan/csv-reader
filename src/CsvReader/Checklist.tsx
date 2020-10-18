import React, { Component } from 'react'
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

export interface ChecklistProp {
    displayHeaders: Array<string>;
    headers: Array<string>;
    updateDisplayHeaders(displayHeaders: Array<string>): void;
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
        let newList = { ...this.state.list, [event.target.name]: event.target.checked };
        this.setState((state: ChecklistState, props: ChecklistProp) => {
            return { list: newList }
        });
        this.updateDisplayHeaders(this.getDisplayHeaders(newList));
    };

    static getDerivedStateFromProps(props: ChecklistProp, state: ChecklistState) {
        return { ...state, list: Checklist.getListState(props.headers, props.displayHeaders) };
    }

    // get master header list and current displayed header list to map to checklist state
    static getListState(headers: string[], displayHeaders: string[]) {
        const checklist: Record<string, boolean> = {};
        headers.forEach(header => {
            checklist[header] = displayHeaders.includes(header);
        });
        return checklist;
    }
    // map checklist obj to display headers array
    getDisplayHeaders(list: Record<string, boolean>): Array<string> {
        const displayHeaders: Array<string> = [];
        for (const [key, value] of Object.entries(list)) {
            if (value) {
                displayHeaders.push(key)
            }
        }
        return displayHeaders;
    }

    render() {
        const { headers } = this.props;
        const { list } = this.state;
        return (
            <div>
                <FormControl required component="fieldset">
                    <FormLabel component="legend">Displayed Columns</FormLabel>
                    <FormGroup>
                        {headers.map(header =>
                            <FormControlLabel
                                key={header}
                                control={
                                    <Checkbox onChange={this.handleChange}
                                        checked={list[header]}
                                        name={header} />
                                }
                                label={header}
                            />
                        )}
                    </FormGroup>
                    <FormHelperText>You can display an error</FormHelperText>
                </FormControl>
            </div>
        )
    }
}
