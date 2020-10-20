import React, { Component, ChangeEvent } from 'react'
import csv from 'csvtojson';
import { Button, LinearProgressProps, LinearProgress, Box, Typography, CircularProgress } from '@material-ui/core';
import './FileUpload.scss'
export interface FileUploadProp {
    onFileChange(data: Array<Record<string, string>>): void;
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
                    this.props.onFileChange(this.mapCsvResultToData(dataRows));

                    this.setState((state) => { return { ...state, loading: false } });
                })
        };
    }

    mapCsvResultToData = (dataRows: Array<Record<string, string>>): Array<Record<string, string>> => {
        const data: Array<Record<string, string>> = [];
        dataRows.forEach((dataRow: Record<string, string>, i: number) => {
            if (i !== 0) { // first row contains col headers
                const builtObject: any = {};

                Object.keys(dataRow).forEach((key: string) => {
                    const valueToAddInBuiltObject = dataRow[key];
                    const keyToAddInBuiltObject = dataRows[0][key];
                    builtObject[keyToAddInBuiltObject] = valueToAddInBuiltObject;
                })
                data.push(builtObject)
            }
        })
        return data;
    }

    uploadFile = () => {
        ((document as Document).getElementById("fileInput") as HTMLInputElement).click()
    }

    render() {
        const { loading } = this.state;
        return (
            <div>
                <input type="file" hidden id='fileInput'
                    accept=".csv" onChange={this.onFileChange} />
                <Button className="upload-file-container" variant="contained" color="primary" onClick={this.uploadFile}>
                    UPLOAD CSV
                </Button>
                {loading ? <CircularProgress /> : <div>done</div>}
            </div>
        )
    }

}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}