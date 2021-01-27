import { combineReducers as reduxCombineReducers } from 'redux';
import { nestedCombineReducers } from '../src/index';

test('Ignores null or undefined properties on the nested Reducers Map', function () {

    const nestedReducersMap: any = {
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

    expect(computedState).toEqual(expectedState);

});

test('Creates a root Reducer from a nested map using combineReducers from Redux', function () {

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

    expect(computedState).toEqual(expectedState);

});

test('Creates a root Reducer correctly when there is no nesting', function () {

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

    expect(computedState).toEqual(expectedState);
});

test('Throws an error when the combineReducers function is undefined', function () {

    const simpleReducersMap = {
        slice: () => 'Slice',
        anotherSlice: () => 'Another slice'
    };

    const undefinedReducersFn: any = undefined;

    expect(() => nestedCombineReducers(simpleReducersMap, undefinedReducersFn)).toThrow();

});

test('Throws an error when the reducers map is undefined', function () {

    const undefinedReducersMap: any = undefined;

    expect(() => nestedCombineReducers(undefinedReducersMap, reduxCombineReducers)).toThrow();

});
