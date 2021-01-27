import { Action, NestedReducersMap, CombineReducersFn, Reducer } from "./types";

/**
 * Takes a Reducers maps with multiple levels of nesting and turns it into in a single reducing function.
 * 
 * @param map An object whose values are either reducing functions or other objects
 * @param combineReducersFn combineReducers compatible function provided by your library of choice
 */
export function nestedCombineReducers<S = any, A extends Action = Action>(
    map: NestedReducersMap<S, A>, 
    combineReducersFn: CombineReducersFn<S, A>
): Reducer<S, A> {

    if (!combineReducersFn) throw new Error('You must specify a combineReducers function.');
    if (!map) throw new Error('You must specify a reducers map.');

    let flatMap: any = {};

    const mapKeys = Object.keys(map);

    for (const mapKey of mapKeys) {

        const propValue = map[mapKey];

        if (propValue === null) continue;
        if (typeof propValue === 'undefined') continue;

        //Hopefully a reducer function, let's store it to combine it later
        if (typeof propValue === 'function') {
            flatMap[mapKey] = propValue;
        }

        //Nesting found, let's go deeper !
        if (typeof propValue === 'object') {
            flatMap[mapKey] = nestedCombineReducers(propValue, combineReducersFn);
        }

    }

    return combineReducersFn(flatMap);

}