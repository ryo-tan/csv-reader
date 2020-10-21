import React, { Component, ChangeEvent, Fragment } from 'react'
import csv from 'csvtojson';
import { Button, CircularProgress } from '@material-ui/core';
import './FileUpload.scss'
export interface FileUploadProp {
    onFileChange(data: Array<Record<string, string>>, headers: Array<string>, fileName: string): void;
}
export interface FileUploadState {
    selectedFile?: File;
    loading: boolean;
}
// to add props to pass data back
export default class FileUpload extends Component<FileUploadProp, FileUploadState> {
    state = {
        selectedFile: undefined,
        loading: false,
    };

    onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        let file: File;
        if (event.target.files) {
            file = event.target.files[0];
        } else {
            return;
        }
        this.setState((state, props) => { return { ...state, selectedFile: file, loading: true } });

        const reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = () => {
            const fileAsBinaryString = reader.result;
            csv({ noheader: true, output: "json" })
                .fromString(fileAsBinaryString as string)
                .then((dataRows: Array<Record<string, string>>) => {
                    if (dataRows.length <= 1) {
                        this.props.onFileChange([], [], file.name);
                    } else {
                        const outputData = this.mapCsvResultToData(dataRows);
                        this.props.onFileChange(outputData, Object.keys(outputData[0]), file.name);
                    }

                    this.setState((state) => { return { ...state, loading: false } });
                })
        };
    }

    mapCsvResultToData = (dataRows: Array<Record<string, string>>): Array<Record<string, string>> => {
        const data: Array<Record<string, string>> = [];
        if (dataRows.length === 1) {
            return data;
        }
        dataRows.forEach((dataRow: Record<string, string>, i: number) => {
            if (i !== 0) { // first row contains col headers
                const builtObject: any = {};

                Object.keys(dataRow).forEach((key: string) => {
                    const valueToAddInBuiltObject = dataRow[key];
                    const keyToAddInBuiltObject = dataRows[0][key];
                    builtObject[keyToAddInBuiltObject] = valueToAddInBuiltObject;
                })
                data.push(builtObject);
            }
        })
        return data;
    }

    uploadFile = () => {
        ((document as Document).getElementById("fileInput") as HTMLInputElement).click();
    }

    render() {
        const { loading } = this.state;
        let loadingComponent;
        if (loading) {
            loadingComponent = <Fragment>
                <CircularProgress />
                <div>Loading data...</div>
            </Fragment>;
        }
        return (
            <div>
                <input type="file" hidden id='fileInput'
                    accept=".csv" onChange={this.onFileChange} />
                <Button className="upload-file-container" variant="contained" color="primary" onClick={this.uploadFile}>
                    UPLOAD CSV
                </Button>
                {loadingComponent}
            </div>
        )
    }

}