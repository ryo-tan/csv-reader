import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SearchableTable } from './Table';
import Checklist from './Checklist';
import FileUpload from './FileUpload';
import './CsvReader.scss';
import { Typography, Box } from '@material-ui/core';
import csvImage from '../images/file.png';
import upload from '../images/upload.png';
import selectColumn from '../images/select-col.png';
import viewDetails from '../images/details.png';

export interface CsvReaderProp {
  browser?: any
}
export interface CsvReaderState {
  data: Array<Record<string, string>>,
  headers: Array<string>,
  displayHeaders: Array<string>,
  fileName?: string
}

class CsvReader extends Component<CsvReaderProp, CsvReaderState> {
  tableData = null;

  state = {
    data: [],
    headers: [],
    displayHeaders: [],
    fileName: undefined,
  }

  onDisplayHeadersChange = (displayHeaders: Array<string>) => {
    this.setState({ displayHeaders });
  }

  onFileChange = (data: Array<Record<string, string>>, headers: Array<string>, fileName: string) => {
    this.setState({
      data,
      headers,
      displayHeaders: headers,
      fileName,
    });
  };

  static updateDisplayHeaders(maxNumberOfCol: number, displayHeaders: Array<string>) {
    const inputDisplayHeaders = [...displayHeaders];
    while (maxNumberOfCol < inputDisplayHeaders.length) {
      inputDisplayHeaders.pop();
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
    const {
      headers, displayHeaders, data, fileName,
    } = this.state;
    let dataComponents;
    let infoDirection = browser.lessThan.large ? 'column' : 'row';
    if (data && data.length) {
      dataComponents = (
        <>
          <div className={'column-checklist-container section-container'}>
            <h3>Columns Displayed</h3>
            <Checklist maxNumOfCol={calculateMaxDisCols(browser)} updateDisplayHeaders={this.onDisplayHeadersChange} headers={headers} displayHeaders={displayHeaders} />
          </div>
          <div className={'section-container'}>
            <h3>Data</h3>
            <Typography variant='body1'>Click on data row to view more data</Typography>
            <SearchableTable data={data} displayHeaders={displayHeaders} />
          </div>
        </>
      );
    } else if (fileName) {
      dataComponents = (
        <div className={'container'}>
          <h3>Data</h3>
          <Typography variant="body2">No data available</Typography>
        </div>
      );
    } else {
      dataComponents = (
        <div className={'container'}>
          <h3>How it works?</h3>
          <Box display='flex' flexDirection={infoDirection} justifyContent='space-between'>
            <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
              <img src={upload} width='50' />
              <h4>1. Upload CSV file</h4>
            </Box>
            <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
              <img src={selectColumn} width='50' />
              <h4>2. Select columns you would like to view</h4>
            </Box>
            <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
              <img src={viewDetails} width='50' />
              <h4>3.View data table</h4>
            </Box>
          </Box>
        </div>
      );
    }
    return (
      <div>
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" className={'hero-container'}>
          <img src={csvImage} width='80' />
          <h1>CSV READER</h1>

          <h4>Upload a csv file to view its data!</h4>

          <FileUpload onFileChange={this.onFileChange} />

          {fileName ? (
            <Typography variant="subtitle2">
              File: {fileName}
            </Typography>
          ) : <></>}
        </Box>
        {dataComponents}
      </div>
    );
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
};

const mapStateToProps = (state: any) => ({ browser: state.browser });

export default connect(mapStateToProps)(CsvReader);
