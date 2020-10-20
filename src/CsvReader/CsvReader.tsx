import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { SearchableTable } from './Table';
import Checklist from './Checklist';
import FileUpload from './FileUpload';
import './CsvReader.scss';

export interface CsvReaderProp {
    browser?: any
}
export interface CsvReaderState {
    data: Array<Record<string, string>>,
    headers: Array<string>,
    displayHeaders: Array<string>,
}

class CsvReader extends Component<CsvReaderProp, CsvReaderState> {
    tableData = null;
    state = {
        data: [],
        headers: [],
        displayHeaders: []
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
        const newDisplayHeaders = displayHeaders ? CsvReader.updateDisplayHeaders(maxNumberOfCol, displayHeaders) : [];
        return { ...state, displayHeaders: newDisplayHeaders };
    }

    render() {
        const { browser } = this.props;
        const { headers, displayHeaders, data } = this.state;
        let dataComponents;
        if (data && data.length) {
            dataComponents =
                <Fragment>
                    <h2>Columns Displayed</h2>
                    <Checklist maxNumOfCol={calculateMaxDisCols(browser)} updateDisplayHeaders={this.onDisplayHeadersChange} headers={headers} displayHeaders={displayHeaders}></Checklist>
                    <h2>Data</h2>
                    <SearchableTable data={data} displayHeaders={displayHeaders}></SearchableTable>
                </Fragment>
        }
        return (
            <div className='page'>
                <h1>CSV Reader</h1>

                <div className='upload-csv-container'>
                    <h2>Upload a file</h2>
                    <FileUpload onFileChange={this.onFileChange} />
                </div>
                {dataComponents}
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
    return 10;
}

const mapStateToProps = (state: any) => {
    return { browser: state.browser }
}

export default connect(mapStateToProps)(CsvReader)
