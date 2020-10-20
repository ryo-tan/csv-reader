import React, { Component } from 'react'
import { connect } from 'react-redux';
import { SearchableTable } from './Table';
import Checklist from './Checklist';
import FileUpload from './FileUpload';

export interface CsvReaderProp {
    browser?: any
}
export interface CsvReaderState {
    data: Array<Record<string, string>>,
    headers: Array<string>,
    displayHeaders: Array<string>,
}

class CsvReader extends Component<CsvReaderProp, CsvReaderState> {
    tableData = data;
    state = {
        data: this.tableData,
        headers: Object.keys(this.tableData[0]),
        displayHeaders: Object.keys(this.tableData[0])
    }
    onDisplayHeadersChange = (displayHeaders: Array<string>) => {
        this.setState({ displayHeaders })
    }

    onFileChange = (data: Array<Record<string, string>>) => {
        this.setState({
            data,
            headers: Object.keys(data[0]),
            displayHeaders: Object.keys(data[0])
        })
    };

    static updateDisplayHeaders(maxNumberOfCol: number, displayHeaders: Array<string>) {
        const inputDisplayHeaders = [...displayHeaders]
        while (maxNumberOfCol < inputDisplayHeaders.length) {
            inputDisplayHeaders.pop()
        }
        return inputDisplayHeaders;
    }

    static getDerivedStateFromProps(props: CsvReaderProp, state: CsvReaderState) {
        const { browser } = props;
        const { displayHeaders } = state;
        const maxNumberOfCol = calculateMaxDisCols(browser);
        const newDisplayHeaders = CsvReader.updateDisplayHeaders(maxNumberOfCol, displayHeaders);
        return { ...state, displayHeaders: newDisplayHeaders };
    }


    render() {
        const { browser } = this.props;
        console.log(browser)
        const { headers, displayHeaders } = this.state;
        console.log(displayHeaders);
        return (
            <div>
                <h1>
                    CSV Reader
                </h1>
                <FileUpload onFileChange={this.onFileChange} />
                <Checklist updateDisplayHeaders={this.onDisplayHeadersChange} headers={headers} displayHeaders={displayHeaders}></Checklist>
                {/* <CollapsibleTable data={this.state.data} displayHeaders={displayHeaders}></CollapsibleTable> */}
                <SearchableTable data={this.state.data} displayHeaders={displayHeaders}></SearchableTable>
            </div>
        )
    }
}


const calculateMaxDisCols = (browser: any): number => {
    if (browser.lessThan.small) {
        return 2;
    }
    if (browser.lessThan.medium) {
        return 3;
    }
    if (browser.lessThan.large) {
        return 5;
    }
    return 7;
}

// TODO: Data to be removed and replaced with csv reader
const data = [
    { name: 'short data', id: '234567' },
    { name: 'med data', id: '2343f47' },
    { name: 'long data', id: '3546786' }
]

const mapStateToProps = (state: any) => {
    console.log('yo', state)
    return { browser: state.browser }
}

export default connect(mapStateToProps)(CsvReader)
