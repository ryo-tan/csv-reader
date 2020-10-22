import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Typography, Box } from '@material-ui/core';
import { IBrowser } from 'redux-responsive/types';
import { IStore } from '../Core/store';

import { SearchableTable } from './Table/Table';
import Checklist from './Checklist/Checklist';
import FileUpload from './FileUpload/FileUpload';

import csvImage from '../images/csv.png';
import upload from '../images/upload.png';
import selectColumn from '../images/select-col.png';
import viewDetails from '../images/details.png';

import './CsvReader.scss';

export interface CsvReaderProps {
  browser: IBrowser
}
export interface CsvReaderState {
  data: Array<Record<string, string>>,
  headers: Array<string>,
  displayHeaders: Array<string>,
  fileName?: string
}

// return maximum col of data headers that can be displayed based on screen size
const calculateMaxDisCols = (browser: IBrowser): number => {
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

function HowItWorks(props: { browser: IBrowser }) {
  const { browser } = props;
  let infoDirection = browser.lessThan.large ? 'column' : 'row';

  return (
    <Box className={'section-container'} display='flex' flexDirection='column'>
      <Box className={'section-title-container'} display='flex' justifyContent='center' alignItems='center'>
        <h2>How it works?</h2>
      </Box>
      <Box display='flex' flexDirection={infoDirection} justifyContent='space-between'>
        <Box className={'instruction-container'} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
          <img src={upload} alt={'Upload file'} width='50' />
          <h4>1. Upload CSV file</h4>
        </Box>
        <Box className={'instruction-container'} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
          <img src={selectColumn} alt={'Select column'} width='50' />
          <h4>2. Select columns you would like to view</h4>
        </Box>
        <Box className={'instruction-container'} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
          <img src={viewDetails} alt={'View details'} width='50' />
          <h4>3. View data table</h4>
        </Box>
      </Box>
    </Box>
  );
}

class CsvReader extends Component<CsvReaderProps, CsvReaderState> {
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

  static getDerivedStateFromProps(props: CsvReaderProps, state: CsvReaderState) {
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

    if (data && data.length) {
      // got data
      dataComponents = (
        <>
          <div className={'column-checklist-container section-container'}>
            <h2>Columns Displayed</h2>
            <Checklist maxNumOfCol={calculateMaxDisCols(browser)} updateDisplayHeaders={this.onDisplayHeadersChange} headers={headers} displayHeaders={displayHeaders} />
          </div>
          <div className={'section-container'}>
            <h2>Data</h2>
            <Typography className={'subtitle section-title-container'}>Click on data row to view more data</Typography>
            <SearchableTable data={data} displayHeaders={displayHeaders} />
          </div>
        </>
      );
    } else if (fileName) {
      // got file but no data
      dataComponents = (
        <div className={'section-container'}>
          <h3>Data</h3>
          <Typography variant="body2">No data available</Typography>
        </div>
      );
    } else {
      // no file uploaded yet
      dataComponents = (
        <HowItWorks browser={browser}></HowItWorks>
      );
    }

    return (
      <div>
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" className={'hero-container section-container'}>
          <img src={csvImage} alt='CSV Reader' height='150px' />
          <h1>CSV READER</h1>

          <FileUpload onFileChange={this.onFileChange} />
        </Box>
        {dataComponents}
      </div>
    );
  }
}



const mapStateToProps = (state: IStore) => ({ browser: state.browser });

export default connect(mapStateToProps)(CsvReader);
