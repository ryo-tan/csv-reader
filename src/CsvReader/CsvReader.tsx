import React, { Component } from 'react'
import { connect } from 'react-redux';
import CollapsibleTable from './Table';
import Checklist from './Checklist';

interface CsvReaderProp {
    browser?: any
}
interface CsvReaderState {
    data: Array<Record<string, string | number>>,
    headers: Array<string>,
    displayHeaders: Array<string>,
}

class CsvReader extends Component<CsvReaderProp, CsvReaderState> {
    tableData = rows;
    state = {
        data: this.tableData,
        headers: Object.keys(this.tableData[0]),
        displayHeaders: Object.keys(this.tableData[0])
    }
    onDisplayHeadersChange = (displayHeaders: Array<string>) => {
        this.setState({ displayHeaders })
    }

    render() {
        const { browser } = this.props;
        console.log(browser)
        const { headers, displayHeaders } = this.state;
        console.log(displayHeaders);
        return (
            <div>
                <h1>
                    Home Page
                </h1>
                <Checklist updateDisplayHeaders={this.onDisplayHeadersChange} headers={headers} displayHeaders={displayHeaders}></Checklist>
                <CollapsibleTable rows={this.state.data} displayHeaders={displayHeaders}></CollapsibleTable>
            </div>
        )
    }
}

// TODO: Data to be removed and replaced with csv reader
export function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
    price: number,
) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
        price,
    };
}
const rows = [
    createData('Frozen yoghurt Frozen yoghurt Frozen yoghurt Frozen yoghurt Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
    createData('Ice cream sandwich Ice cream sandwichIce cream sandwich Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
    createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
    createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
    createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];

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
