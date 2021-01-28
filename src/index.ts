import { Action, Reducer, combineReducers, CombinedState, ReducersMapObject } from "redux";

/**
 * Types of the possibile values of RecursiveReducersMapObject
 */
export type RecursiveReducersMapProperty<S, A extends Action = Action> =
    Reducer<S, A> |
    RecursiveReducersMapObject<S, A> |
    null |
    undefined;

/**
 * A ReducersMapObject with multiple levels of nesting
 */
export type RecursiveReducersMapObject<S = any, A extends Action = Action> = {
    [K in keyof S]: RecursiveReducersMapProperty<S[K], A>;
}

type PlainRecursiveReducersMapObjectProperty =
    Reducer<unknown, Action> |
    RecursiveReducersMapObject<unknown, Action> |
    null |
    undefined;

/**
 * A RecursiveReducersMapObject with properties accesible using strings
 */
type PlainRecursiveReducersMapObject = {
    [key: string]: PlainRecursiveReducersMapObjectProperty
}

/**
 * Takes a Reducers maps with multiple levels of nesting and turns it into in a single reducing function.
 * 
 * @param map An object whose values are either reducing functions or other objects
 * @param combineReducersFn combineReducers compatible function provided by your library of choice
 */
export function nestedCombineReducers<S = any, A extends Action = Action>(
    map: RecursiveReducersMapObject<S, A>
): Reducer<CombinedState<S>, A> {

    if (!map) throw new Error('You must specify a reducers map.');

    const flatReducersMapObject: ReducersMapObject = {};

    const mapKeys = Object.keys(map);

    //Enable string property accessors by type casting
    const plainMap = map as PlainRecursiveReducersMapObject;

    for (const mapKey of mapKeys) {

        const propValue = plainMap[mapKey];

        if (propValue === null) {
            continue;
        }

        if (propValue === undefined) {
            continue;
        }

        //Hopefully a reducer function, let's store it to combine it later
        if (typeof propValue === 'function') {
            flatReducersMapObject[mapKey] = propValue as Reducer;
        }

        //Nesting found, let's go deeper !
        if (typeof propValue === 'object') {
            flatReducersMapObject[mapKey] = nestedCombineReducers(propValue);
        }

    }

    return combineReducers(flatReducersMapObject);

}