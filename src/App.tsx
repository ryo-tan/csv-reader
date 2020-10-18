import React, { Suspense } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import store from './Core/store';
import CsvReader from './CsvReader/CsvReader';

function App() {
  return (
    <div className='App-header'>
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path="/" component={CsvReader} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </Provider>
    </div>
  );
}


export default App;
