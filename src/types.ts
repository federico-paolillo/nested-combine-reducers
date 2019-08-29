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
