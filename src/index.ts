export interface Action<T = any> {
    type: T;
}

export type Reducer<S = any, A extends Action = Action> = (state: S | undefined, action: A) => S;

export type ReducersMap<S = any, A extends Action = Action> = {
    [prop in keyof S]: Reducer<S[prop], A>;
}

export type NestedReducersMap<S = any, A extends Action = Action> = {
    [prop in keyof S]: Reducer<S[prop], A> | NestedReducersMap<S[prop], A>
}

export type CombineReducersFn<S = any, A extends Action = Action> = (reducersMap: ReducersMap<S, A>) => Reducer<S, A>

export function nestedCombineReducers<S = any, A extends Action = Action>(
    reducersMap: NestedReducersMap<S, A>,
    combineReducers: CombineReducersFn<S, A>
): Reducer<S, A> {

    let flatMap: any = {};

    const mapKeys = Object.keys(reducersMap);

    for (const mapKey of mapKeys) {

        const propValue = reducersMap[mapKey];

        if (propValue === null) continue;
        if (typeof propValue === 'undefined') continue;

        //Hopefully a reducer function, let's store it to combine it later
        if (typeof propValue === 'function') {
            flatMap[mapKey] = propValue;
        }

        //Nesting found, let's go deeper !
        if (typeof propValue === 'object') {
            flatMap[mapKey] = nestedCombineReducers(propValue, combineReducers);
        }

    }

    return combineReducers(flatMap);

}