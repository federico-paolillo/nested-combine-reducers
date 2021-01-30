import { Action, Reducer, combineReducers, CombinedState, ReducersMapObject } from "redux";

/**
 * Union of all the allowed types of a RecursiveReducersMapObject
 */
export type RecursiveReducersMapObjectProperty<TState = any, TAction extends Action = Action> = 
    Reducer<TState, TAction> |
    RecursiveReducersMapObject<TState, TAction> | 
    null | 
    undefined;

/**
 * A ReducersMapObject with multiple levels of nesting
 */
export type RecursiveReducersMapObject<TState = any, TAction extends Action = Action> = {
    [Key in keyof TState]: RecursiveReducersMapObjectProperty<TState[Key], TAction>;
}

/**
 * Takes a Reducers maps with multiple levels of nesting and turns it into in a single reducing function.
 * 
 * @param map An object whose values are either reducing functions or other objects
 */
export function nestedCombineReducers<TState = any, TAction extends Action = Action>(
    map: RecursiveReducersMapObject<TState, TAction>
): Reducer<CombinedState<TState>, TAction> {

    if (!map) throw new Error('You must specify a reducers map.');

    const flatReducersMapObject: ReducersMapObject = {};

    const recursiveMapKeys = Object.keys(map) as (keyof TState)[];

    for (const recursiveMapKey of recursiveMapKeys) {

        const recursiveMapValue = map[recursiveMapKey];

        if (recursiveMapValue === null) {
            continue;
        }

        if (recursiveMapValue === undefined) {
            continue;
        }

        //Hopefully a reducer function, let's store it to combine it later
        if (typeof recursiveMapValue === 'function') {

            const reducer = recursiveMapValue as Reducer;

            flatReducersMapObject[recursiveMapKey] = reducer;
        }

        //Nesting found, let's go deeper !
        if (typeof recursiveMapValue === 'object') {

            const nestedRecursiveReducersMapObject = recursiveMapValue as RecursiveReducersMapObject;

            flatReducersMapObject[recursiveMapKey] = nestedCombineReducers(nestedRecursiveReducersMapObject);
        }

    }

    return combineReducers(flatReducersMapObject);

}