import React, { Component, ChangeEvent } from 'react';
import csv from 'csvtojson';
import { Button, CircularProgress, Box } from '@material-ui/core';
import './FileUpload.scss';
import { connect } from 'react-redux';
import { IBrowser } from 'redux-responsive/types';
import { IStore } from '../../Core/store';

export interface FileUploadProps {
  onFileChange(data: Array<Record<string, string>>, headers: Array<string>, fileName: string): void;
  browser?: IBrowser
}
export interface FileUploadState {
  loading: boolean;
  fileName?: string;
}


function DataLoading() {
  return (
    <Box display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
      <CircularProgress />
      <h4>We are preparing your data...</h4>
    </Box>
  );
}

export class FileUpload extends Component<FileUploadProps, FileUploadState> {
  state = {
    loading: false,
    fileName: undefined
  };

  onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    let file: File;
    if (event.target.files) {
      file = event.target.files[0];
      if (!file) {
        return;
      }
    } else {
      return;
    }
    this.setState((state, props) => ({ ...state, fileName: file.name, loading: true }));

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = () => {
      const fileAsBinaryString = reader.result;
      csv({ noheader: true, output: 'json' })
        .fromString(fileAsBinaryString as string)
        .then((dataRows: Array<Record<string, string>>) => {
          if (dataRows.length <= 1) {
            this.props.onFileChange([], [], file.name);
          } else {
            const outputData = this.mapCsvResultToData(dataRows);
            this.props.onFileChange(outputData, Object.keys(outputData[0]), file.name);
          }

          this.setState((state) => ({ ...state, loading: false }));
        });
    };
  }

  mapCsvResultToData = (dataRows: Array<Record<string, string>>): Array<Record<string, string>> => {
    const data: Array<Record<string, string>> = [];
    if (dataRows.length === 1) {
      return data;
    }
    dataRows.forEach((dataRow: Record<string, string>, i: number) => {
      if (i !== 0) { // first row contains col headers
        const builtObject: Record<string, string> = {};

        Object.keys(dataRow).forEach((key: string) => {
          const valueToAddInBuiltObject = dataRow[key];
          const keyToAddInBuiltObject = dataRows[0][key];
          builtObject[keyToAddInBuiltObject] = valueToAddInBuiltObject;
        });
        data.push(builtObject);
      }
    });
    return data;
  }

  uploadFile = () => {
    ((document as Document).getElementById('fileInput') as HTMLInputElement).click();
  }

  render() {
    const { loading, fileName } = this.state;
    const { browser } = this.props;

    const buttonLabel = fileName ? `UPLOAD ANOTHER CSV` : `UPLOAD CSV`;
    let fileInfoComponent;
    if (loading) {
      fileInfoComponent = (
        <DataLoading></DataLoading>
      );
    } else {
      if (fileName) {
        // if got file uploaded
        fileInfoComponent = (
          <Box className={'file-name-container'}>
            <Box className={'file-name'} onClick={this.uploadFile}>{fileName}</Box>
          </Box>
        );
      } else {
        fileInfoComponent = (
          <h4>Want to view your data? Upload your file now!</h4>
        );
      }
    }
    return (
      <>
        {fileInfoComponent}
        <input
          type="file"
          hidden
          id="fileInput"
          accept=".csv"
          onChange={this.onFileChange}
        />
        <Button disabled={loading} className={(browser!.is.extraSmall ? 'mobile-upload-button' : '')} variant="contained" color="primary" onClick={this.uploadFile}>
          {buttonLabel}
        </Button>
      </>
    );
  }
}
const mapStateToProps = (storeState: IStore, ownProps: FileUploadProps) => ({ ...ownProps, browser: storeState.browser });

export default connect(mapStateToProps)(FileUpload);
