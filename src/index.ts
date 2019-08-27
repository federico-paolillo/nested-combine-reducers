/**
 * The simplest definition of an Action
 */
export interface Action<T = any> {
    type: T;
}

/**
 * An object whose properties are reducing functions.
 */
export type ReducersMap<S = any, A extends Action = Action> = {
    [prop in keyof S]: Reducer<S[prop], A>;
}

/**
 * An object whose properties are either reducing function or @see NestedReducersMap
 */
export type NestedReducersMap<S = any, A extends Action = Action> = {
    [prop in keyof S]: Reducer<S[prop], A> | NestedReducersMap<S[prop], A>
}

/**
 * A reducing function
 */
export type Reducer<S = any, A extends Action = Action> = (state: S | undefined, action: A) => S;

/**
 * A function that turns an object whose properties are reducing functions into a single reducing function.
 */
export type CombineReducersFn<S = any, A extends Action = Action> = (reducersMap: ReducersMap<S, A>) => Reducer<S, A>

/**
 * Execution data recorded to resume a partial execution later on
 */
interface StackFrame {

	flatMap: object;

	mapKeys: string[];

	currentMapKey: number;
}

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

	//Initialize manual Stack with initial values
	const manualStack: StackFrame[] = [
		{
			flatMap: {},
			mapKeys: Object.keys(map),
			currentMapKey: 0
		}
	];

	//We continue until the manual Stack is drained
	while (manualStack.length > 0) {

	}

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