import * as chai from 'chai';
import { combineReducers as reduxCombineReducers } from 'redux';

import { nestedCombineReducers, infiniteNestedCombineReducers } from '.';

const assert = chai.assert;

describe('nestedCombineReducers', function () {

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

    it('Creates a root Reducer from a nested map using combineReducers from Redux', function () {

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

    it('Creates a root Reducer correctly when there is no nesting', function () {

        const simpleReducersMap = {
            slice: () => 'Slice',
            anotherSlice: () => 'Another slice'
        };

        const rootReducer = nestedCombineReducers(simpleReducersMap, reduxCombineReducers);

        const expectedState = {
            slice: 'Slice',
            anotherSlice: 'Another slice'
        };

        const computedState = rootReducer({}, { type: 'Fake' });

        assert.deepEqual(computedState, expectedState);
    });

    it('Throws an error when the combineReducers function is undefined', function () {

        const simpleReducersMap = {
            slice: () => 'Slice',
            anotherSlice: () => 'Another slice'
        };

        const combineReducersFn: any = undefined;

        const nestedCombineReducersArrowFn = () => nestedCombineReducers(simpleReducersMap, combineReducersFn);

        assert.throws(nestedCombineReducersArrowFn);

    });

    it('Throws an error when the reducers map is undefined', function () {

        const undefinedReducersMap: any = undefined;

        const nestedCombineReducersArrowFn = () => nestedCombineReducers(undefinedReducersMap, reduxCombineReducers);

        assert.throws(nestedCombineReducersArrowFn);

    });

});

describe('infiniteNestedCombineReducers', function () {

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

        const rootReducer = infiniteNestedCombineReducers(nestedReducersMap, reduxCombineReducers);

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

    it('Creates a root Reducer from a nested map using combineReducers from Redux', function () {

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

        const rootReducer = infiniteNestedCombineReducers(nestedReducersMap, reduxCombineReducers);

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

    it('Creates a root Reducer correctly when there is no nesting', function () {

        const simpleReducersMap = {
            slice: () => 'Slice',
            anotherSlice: () => 'Another slice'
        };

        const rootReducer = infiniteNestedCombineReducers(simpleReducersMap, reduxCombineReducers);

        const expectedState = {
            slice: 'Slice',
            anotherSlice: 'Another slice'
        };

        const computedState = rootReducer({}, { type: 'Fake' });

        assert.deepEqual(computedState, expectedState);
    });

    it('Throws an error when the combineReducers function is undefined', function () {

        const simpleReducersMap = {
            slice: () => 'Slice',
            anotherSlice: () => 'Another slice'
        };

        const combineReducersFn: any = undefined;

        const nestedCombineReducersArrowFn = () => infiniteNestedCombineReducers(simpleReducersMap, combineReducersFn);

        assert.throws(nestedCombineReducersArrowFn);

    });

    it('Throws an error when the reducers map is undefined', function () {

        const undefinedReducersMap: any = undefined;

        const nestedCombineReducersArrowFn = () => infiniteNestedCombineReducers(undefinedReducersMap, reduxCombineReducers);

        assert.throws(nestedCombineReducersArrowFn);

    });

});