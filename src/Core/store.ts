import { createStore } from 'redux';
import { responsiveStoreEnhancer } from 'redux-responsive';
import reducer from './reducer';
import { IBrowser } from 'redux-responsive/types';

export interface IStore {
    browser: IBrowser;
}
const store = createStore(reducer, responsiveStoreEnhancer);

export default store;
