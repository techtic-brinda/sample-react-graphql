import allReducer from './reducers';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const initialState = {};
export const initializeStore = (preloadedState = initialState) => {
    return createStore(combineReducers(allReducer), preloadedState, compose(applyMiddleware(thunk)))
}