import { combineReducers as reduxCombineReducers } from 'redux';

import * as chai from 'chai';

import { nestedCombineReducers } from '.';

const assert = chai.assert;

describe('Core', function () {

    it('Ignores null or undefined properties on the nested Reducers Map', function () {

        const nestedReducersMap = {
            slice: {
                deepSlice: {
                    deeperSlice: undefined,
                    anotherDeeperSlice: () => 'anotherDeeperSlice'
                }
            },
            moreSlices: null
        };

        const rootReducer = nestedCombineReducers(nestedReducersMap, reduxCombineReducers);

        const expectedState = {
            slice: {
                deepSlice: {
                    anotherDeeperSlice: 'anotherDeeperSlice'
                }
            }
        };

        const computedState = rootReducer({}, { type: 'FAKE' });

        assert.deepEqual(computedState, expectedState);

    });

});

describe('Redux support', function () {

    it('Creates a root Reducer that returns an Object with a shape identical to the nested Reducers Map shape', function () {

        //These Reducers do not do anything. 
        //We only expect that the final Root Reducer returns an object identical to the nested Reducers Map shape
        const nestedReducersMap = {
            slice: {
                deepSlice: {
                    deeperSlice: () => 'deeperSlice',
                    anotherDeeperSlice: () => 'anotherDeeperSlice'
                }
            }
        };

        const rootReducer = nestedCombineReducers(nestedReducersMap, reduxCombineReducers);

        const expectedState = {
            slice: {
                deepSlice: {
                    deeperSlice: 'deeperSlice',
                    anotherDeeperSlice: 'anotherDeeperSlice'
                }
            }
        };

        const computedState = rootReducer({}, { type: 'FAKE' });

        assert.deepEqual(computedState, expectedState);

    });

});