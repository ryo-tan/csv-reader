import React, { Suspense } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { teal, orange } from '@material-ui/core/colors';
import store from './Core/store';
import CsvReader from './CsvReader/CsvReader';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[700],
    },
    secondary: {
      main: orange.A400,
    },
  },
});
function App() {
  return (
    <div className="App-header">
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route exact path="/" component={CsvReader} />
              </Switch>
            </Suspense>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </div>
  );
}

export default App;
