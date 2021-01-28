import { Action, Reducer, combineReducers, CombinedState, ReducersMapObject } from "redux";

export type RecursiveReducersMapProperty<S, A extends Action = Action> = Reducer<S, A> | RecursiveReducersMapObject<S, A> | null | undefined;

export type RecursiveReducersMapObject<S = any, A extends Action = Action> = {
    [K in keyof S]: RecursiveReducersMapProperty<S[K], A>;
}

export type RecursiveReducersMapPlainObject<S = any, A extends Action = Action> = {
    [key: string]: Reducer<S, A> | RecursiveReducersMapPlainObject<typeof S[key], A> | null | undefined;
}

/**
 * Takes a Reducers maps with multiple levels of nesting and turns it into in a single reducing function.
 * 
 * @param map An object whose values are either reducing functions or other objects
 * @param combineReducersFn combineReducers compatible function provided by your library of choice
 */
export function nestedCombineReducers<S = any, A extends Action = Action>(map: RecursiveReducersMapObject<S, A>): Reducer<CombinedState<S>, A> {

    if (!map) throw new Error('You must specify a reducers map.');

    const flatMap: ReducersMapObject = {};

    const mapKeys = Object.keys(map);

    for (const mapKey of mapKeys) {

        const propValue = map[mapKey];

        if (propValue === null) continue;
        if (typeof propValue === 'undefined') continue;

        //Hopefully a reducer function, let's store it to combine it later
        if (typeof propValue === 'function') {
            flatMap[mapKey] = propValue as Reducer;
        }

        //Nesting found, let's go deeper !
        if (typeof propValue === 'object') {
            flatMap[mapKey] = nestedCombineReducers(propValue);
        }

    }

    return combineReducers(flatMap);

}