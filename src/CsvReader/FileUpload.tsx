import React, { Component, ChangeEvent } from 'react'
import csv from 'csvtojson';

export interface FileUploadProp {
    onFileChange(data: Array<Record<string, string>>): void;
}
// to add props to pass data back
export default class FileUpload extends Component<FileUploadProp> {
    state = {
        selectedFile: null,
        loading: false
    };

    onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        let file: File;
        if (event.target.files) {
            file = event.target.files[0];
        } else {
            return;
        }
        this.setState({ selectedFile: file, loading: true });

        const reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = () => {
            const fileAsBinaryString = reader.result;
            csv({ noheader: true, output: "json" })
                .fromString(fileAsBinaryString as string)
                .then((dataRows: Array<Record<string, string>>) => {
                    // console.log(this.mapCsvResultToData(dataRows))
                    this.props.onFileChange(this.mapCsvResultToData(dataRows));
                    this.setState((state) => { return { ...state, loading: false } });
                })
        };
    }

    mapCsvResultToData = (dataRows: Array<Record<string, string>>): Array<Record<string, string>> => {
        const data: Array<Record<string, string>> = [];
        dataRows.forEach((dataRow: Record<string, string>, i: number) => {
            if (i !== 0) { // first row contains col headers
                const builtObject: any = {}
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

    render() {
        const { loading } = this.state;
        return (
            <div>
                <input type="file"
                    accept=".csv" onChange={this.onFileChange} />
                {loading ? <div>LOADING...</div> : <div>done</div>}
            </div>
        )
    }
}

