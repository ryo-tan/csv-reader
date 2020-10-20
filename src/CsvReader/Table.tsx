import React, { Fragment, Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { TextField } from '@material-ui/core';
import Highlight from 'react-highlighter';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
        width: '100%'
    },
});

function Detail(props: { label: string, value: string }) {
    const { label, value } = props;
    return (
        <Fragment>
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>{label}</Typography>
            <Typography variant="body1">{value}</Typography>
        </Fragment>
    );
}

function Row(props: { row: Record<string, string>, headers: Array<string>, searchTerm: string }) {
    const { row, headers, searchTerm } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    return (
        <React.Fragment>
            <TableRow className={classes.root} onClick={() => setOpen(!open)}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                {
                    headers.map(header => <TableCell key={header} >
                        <Highlight search={searchTerm}>
                            {row[header]}
                        </Highlight>
                    </TableCell>)
                }
            </TableRow>
            <TableRow >
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length + 1} >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            {
                                Object.keys(row).map((key: string) =>
                                    <Detail key={key} label={key} value={row[key]} />
                                )
                            }
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


function CollapsibleTable(props: { data: Array<Record<string, string>>, displayHeaders: Array<string>, searchTerm: string }) {
    const { data, displayHeaders, searchTerm } = props;
    const [page, setPage] = React.useState(0); // start from pageIndex 0
    const [rowsPerPage, setRowsPerPage] = React.useState(10); // default to 10 per page
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Fragment>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            {
                                displayHeaders.map(header => <TableCell key={header}>{header}</TableCell>)
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index: number) => (
                            <Row key={index} row={row} headers={displayHeaders} searchTerm={searchTerm} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Fragment>
    );
}

export interface SearchableTableProps {
    data: Array<Record<string, string>>;
    displayHeaders: Array<string>;
}

export interface SearchableTableState {
    searchTerm: string;
}

export class SearchableTable extends Component<SearchableTableProps, SearchableTableState> {
    state = {
        searchTerm: ''
    }

    onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        // update state with trimmed search term
        this.setState({ searchTerm: value.trim() });
    };

    filter = (searchTerm: string, data: Array<Record<string, string>>) => {
        return data.filter(function (obj) {
            return Object.keys(obj).some(function (key) {
                return (obj[key]).toLowerCase().includes(searchTerm.toLowerCase());
            })
        });
    }

    render() {
        const { data, displayHeaders } = this.props;
        const { searchTerm } = this.state
        const filteredData = this.filter(searchTerm, data);
        return (
            <Fragment>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search in all coloumns"
                    inputProps={{ 'aria-label': 'Search in all coloumns' }}
                    onChange={this.onInputChange}
                />
                <CollapsibleTable data={filteredData} displayHeaders={displayHeaders} searchTerm={searchTerm}></CollapsibleTable>
            </Fragment>
        )
    }
}
